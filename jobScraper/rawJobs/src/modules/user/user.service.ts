import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/CreateUser.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createUser(user: CreateUserDto) {
    const existingUser = await this.userModel.findOne({
      email: user.email,
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const saltRounds = parseInt(process.env.SALT_ROUNDS);
    if (isNaN(saltRounds)) {
      throw new BadRequestException('Invalid salt rounds configuration');
    }

    try {
      const salt = bcrypt.genSaltSync(saltRounds);
      user.password = await bcrypt.hashSync(user.password, salt);

      const newUser = new this.userModel(user);
      const savedUser = await newUser.save();

      return savedUser;
    } catch (error) {
      throw new BadRequestException('Failed to create user: ' + error.message);
    }
  }

  async getAllUsers() {
    const users = await this.userModel.find();
    if (users.length === 0) {
      throw new NotFoundException('No users found');
    }
    return users;
  }

  async getUserById(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getCurrentUser(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUser(id: string, user: UpdateUserDto) {
    if (user.password) {
      const saltRounds = parseInt(process.env.SALT_ROUNDS);
      if (isNaN(saltRounds)) {
        throw new BadRequestException('Invalid salt rounds configuration');
      }
      const salt = bcrypt.genSaltSync(saltRounds);
      user.password = await bcrypt.hashSync(user.password, salt);
    }
    const result = await this.userModel.findByIdAndUpdate(
      id,
      { $set: user },
      { new: true },
    );
    if (!result) {
      throw new NotFoundException('User not found');
    }
    return result;
  }

  async deleteUser(id: string) {
    const user = await this.userModel.findByIdAndDelete(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return { message: 'User deleted successfully' };
  }
}
