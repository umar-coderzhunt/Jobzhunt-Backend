import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/entity/user.entity';
import * as bcrypt from 'bcrypt';
import { AuthHelper } from './helper/auth.helper';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { CurrentUser } from 'src/shared/interface/userContext.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly authHelper: AuthHelper,
  ) {}

  async login(user: LoginDto) {
    const result = await this.userModel.findOne({
      email: user.email,
    });
    if (!result) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(
      user.password,
      result.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return await this.authHelper.token(result);
  }

  async resetPassword(user: ResetPasswordDto, currentUser: CurrentUser) {
    const result = await this.userModel.findById(currentUser.id);
    if (!result) {
      throw new NotFoundException('User not found');
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      user.currentPassword,
      result.password,
    );
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('You entered incorrect password');
    }

    if (user.password !== user.confirmPassword) {
      throw new Error('New password and confirm password do not match');
    }

    const saltRounds = parseInt(process.env.SALT_ROUNDS);
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = await bcrypt.hashSync(user.password, salt);
    const updatedUser = await this.userModel.findOneAndUpdate(
      { _id: currentUser.id },
      { password: hashedPassword },
      { new: true },
    );

    return updatedUser;
  }
}
