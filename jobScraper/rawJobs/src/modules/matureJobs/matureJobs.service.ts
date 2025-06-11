import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MatureJob } from './entity/matureJobs.entity';
import { CreateMatureJobDto } from './dto/createMatureJob.dto';
import { UpdateAppliedByDto } from './dto/updateAppliedBy.dto';

@Injectable()
export class MatureJobsService {
  constructor(
    @InjectModel(MatureJob.name)
    private readonly matureJobModel: Model<MatureJob>,
  ) {}

  async createMatureJob(matureJob: CreateMatureJobDto) {
    const createdMatureJob = await this.matureJobModel.create(matureJob);
    return createdMatureJob;
  }

  async getAllMatureJobs(page?: number, limit?: number) {
    const defaultPage = 1;
    const defaultLimit = 10;

    const currentPage = page || defaultPage;
    const itemsPerPage = limit || defaultLimit;
    const skip = (currentPage - 1) * itemsPerPage;

    const [matureJobs, total] = await Promise.all([
      this.matureJobModel
        .find()
        .sort({ createdAt: -1 })
        .populate({
          path: 'rawJob',
        })
        .populate({
          path: 'appliedBy',
          select: 'firstName lastName',
        })
        .skip(skip)
        .limit(itemsPerPage)
        .exec(),
      this.matureJobModel.countDocuments(),
    ]);

    return {
      matureJobs,
      totalRecords: total,
      page: currentPage,
      limit: itemsPerPage,
    };
  }

  async updateAppliedBy(
    matureJobId: string,
    { add = [], remove = [], isRelevant }: UpdateAppliedByDto,
  ) {
    const matureJob = await this.matureJobModel.findById(matureJobId);
    if (!matureJob) {
      throw new NotFoundException('Mature job not found');
    }

    if (add.length > 0 || remove.length > 0) {
      const appliedBySet = new Set(
        matureJob.appliedBy.map((id) => id.toString()),
      );

      for (const userId of remove) {
        appliedBySet.delete(userId);
      }

      for (const userId of add) {
        appliedBySet.add(userId);
      }

      matureJob.appliedBy = Array.from(appliedBySet).map(
        (id) => new Types.ObjectId(id),
      );
    }

    if (isRelevant !== undefined) {
      matureJob.isRelevant = isRelevant;
    }

    await matureJob.save();
    return matureJob;
  }
}
