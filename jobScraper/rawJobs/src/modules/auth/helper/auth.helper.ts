import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../user/entity/user.entity';

@Injectable()
export class AuthHelper {
  constructor(private readonly jwtService: JwtService) {}

  token(user: User) {
    const payload = {
      id: user._id,
      role: user.role,
    };
    return this.jwtService.signAsync(payload);
  }
}
