import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile } from './entity/profile.entity';
import { CreateProfileDto } from './dto/createProfile.dto';
import { UpdateProfileDto } from './dto/updateProfile.dto';
import { UserRole } from 'src/shared/enums/usersRoles.enum';
import { CurrentUser } from 'src/shared/interface/userContext.interface';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name)
    private profileModel: Model<Profile>,
  ) {}

  async createProfile(createProfileDto: CreateProfileDto) {
    const profile = await this.profileModel.create(createProfileDto);
    return profile;
  }

  async getAllProfiles(user: CurrentUser, page?: number, limit?: number) {
    const defaultPage = 1;
    const defaultLimit = 10;

    const currentPage = page || defaultPage;
    const itemsPerPage = limit || defaultLimit;
    const skip = (currentPage - 1) * itemsPerPage;

    let query = {};
    if (user.role === UserRole.USER) {
      query = {
        $or: [{ businessDevelopers: user.id }, { technicalDeveloper: user.id }],
      };
    }

    const [profiles, total] = await Promise.all([
      this.profileModel
        .find(query)
        .skip(skip)
        .limit(itemsPerPage)
        .populate({
          path: 'businessDevelopers',
          select: 'firstName lastName',
        })
        .populate({
          path: 'technicalDeveloper',
          select: 'firstName lastName',
        }),
      this.profileModel.countDocuments(query),
    ]);

    return {
      profiles,
      totalRecords: total,
      page: currentPage,
      limit: itemsPerPage,
      totalPages: Math.ceil(total / itemsPerPage),
    };
  }

  async getProfileById(id: string) {
    const profile = await this.profileModel
      .findById(id)
      .populate({
        path: 'businessDevelopers',
        select: 'firstName lastName',
      })
      .populate({
        path: 'technicalDeveloper',
        select: 'firstName lastName',
      })
      .exec();
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }

  async updateProfileById(id: string, profileDto: UpdateProfileDto) {
    const profile = await this.profileModel.findByIdAndUpdate(
      id,
      { $set: profileDto },
      { new: true },
    );
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }
}
