import { Module } from '@nestjs/common';
import { MatureJobsService } from './matureJobs.service';
import { MatureJobsController } from './matureJobs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MatureJob, MatureJobSchema } from './entity/matureJobs.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MatureJob.name, schema: MatureJobSchema },
    ]),
  ],
  controllers: [MatureJobsController],
  providers: [MatureJobsService],
})
export class MatureJobsModule {}
