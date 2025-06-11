import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { RawJobsController } from './rawJobs.controller';
import { RawJobsService } from './rawJobs.service';
import { RawJob, RawJobSchema } from './entity/rawJob.entity';
import { RawJobsCronService } from './rawJobs.cron';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([{ name: RawJob.name, schema: RawJobSchema }]),
    forwardRef(() => AuthModule),
    HttpModule,
  ],
  controllers: [RawJobsController],
  providers: [RawJobsService, RawJobsCronService],
  exports: [RawJobsService],
})
export class RawJobsModule {}
