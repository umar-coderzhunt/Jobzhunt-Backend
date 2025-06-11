import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { RawJobsService } from './rawJobs.service';
import { JOB_KEYWORDS, SEARCH_PARAMS } from './constants/rawJob.constants';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RawJobsCronService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RawJobsCronService.name);
  private readonly MATURE_JOB_ENDPOINT = process.env.MATURE_JOB_URL;

  constructor(
    private readonly rawJobsService: RawJobsService,
    private readonly httpService: HttpService,
  ) {
    if (!this.MATURE_JOB_ENDPOINT) {
      this.logger.warn('MATURE_JOB_URL is not set in environment variables');
    } else {
      this.logger.log(
        `Mature job endpoint configured: ${this.MATURE_JOB_ENDPOINT}`,
      );
    }
  }

  async onModuleInit() {
    this.logger.log('Initializing cron job for job search');
  }

  async onModuleDestroy() {
    this.logger.log('Destroying cron job for job search');
  }

  @Cron(CronExpression.EVERY_DAY_AT_4AM)
  async handleRawJobsCron() {
    this.logger.log('Starting cron job for job search');

    for (const keyword of JOB_KEYWORDS) {
      this.logger.log(`Searching jobs for keyword: ${keyword}`);
      let page = 0;
      let hasMoreJobs = true;

      while (hasMoreJobs) {
        try {
          const searchParams = {
            keyword: keyword,
            ...SEARCH_PARAMS,
            page: page.toString(),
          };

          const jobs = await this.rawJobsService.fetchJobs(searchParams);

          if (jobs.length === 0) {
            this.logger.log(
              `No more jobs found for keyword: ${keyword} on page ${page}`,
            );
            hasMoreJobs = false;
          } else {
            this.logger.log(
              `Found ${jobs.length} jobs for keyword: ${keyword} on page ${page}`,
            );
            page++;
          }
        } catch (error) {
          this.logger.error(
            `Error searching jobs for keyword ${keyword} on page ${page}: ${error.message}`,
          );
          hasMoreJobs = false;
        }
      }
    }

    this.logger.log('Completed cron job for job search');

    try {
      this.logger.log(
        'Starting mature job processing - this may take several minutes',
      );
      const response = await firstValueFrom(
        this.httpService.post(
          this.MATURE_JOB_ENDPOINT,
          {},
          {
            validateStatus: (status) => status < 500,
          },
        ),
      );

      if (response.status === 200) {
        this.logger.log('Mature job pipeline completed successfully');
      } else {
        this.logger.warn(
          `Mature job pipeline completed with status ${response.status}`,
        );
      }
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        this.logger.error(
          `Failed to connect to mature job service at ${this.MATURE_JOB_ENDPOINT}. Is the service running?`,
        );
      } else {
        this.logger.error(
          `Error during mature job processing: ${error.message}`,
        );
      }
      throw error;
    }
  }
}
