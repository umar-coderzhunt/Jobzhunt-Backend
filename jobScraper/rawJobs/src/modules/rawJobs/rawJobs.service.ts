import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RawJob } from './entity/rawJob.entity';
import { SearchJobsDto } from './dto/searchJobs.dto';
import * as linkedIn from 'linkedin-jobs-api';

@Injectable()
export class RawJobsService {
  private readonly logger = new Logger(RawJobsService.name);

  constructor(
    @InjectModel(RawJob.name) private readonly rawJobModel: Model<RawJob>,
  ) {}

  async fetchJobs(searchParams: SearchJobsDto) {
    try {
      const jobs = await linkedIn.query(searchParams);
      this.logger.log(`Total jobs fetched from LinkedIn: ${jobs.length}`);
      const existingJobs = await this.rawJobModel.find({
        $or: jobs.map((job) => ({
          $and: [
            { position: job.position },
            { company: job.company },
            { location: job.location },
            { date: job.date },
          ],
        })),
      });

      const existingKeySet = new Set<string>(
        existingJobs.map(
          (j) => `${j.position}|${j.company}|${j.location}|${j.date}`,
        ),
      );

      const newJobs = jobs.filter((job) => {
        const key = `${job.position}|${job.company}|${job.location}|${job.date}`;
        return !existingKeySet.has(key);
      });

      newJobs.forEach(async (job) => {
        if (
          !job.position ||
          !job.company ||
          !job.location ||
          !job.date ||
          !job.jobUrl
        ) {
          return;
        }

        const jobData = {
          position: job.position,
          company: job.company,
          location: job.location,
          date: job.date,
          jobUrl: job.jobUrl,
          salary: job.salary || 'Not specified',
          companyLogo: job.companyLogo || '',
          agoTime: job.agoTime || '',
          isEasyApply: false,
          isMatureJob: false,
          linkPassed: false,
        };

        await this.rawJobModel.create(jobData);
      });
      return newJobs;
    } catch (error) {
      this.logger.error(`Error fetching jobs: ${error.message}`);
      throw error;
    }
  }
}
