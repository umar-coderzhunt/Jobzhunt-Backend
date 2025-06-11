import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { User, UserSchema } from '../user/entity/user.entity';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { AuthHelper } from './helper/auth.helper';
import { GlobalJwtModule } from '../globalJwt/globalJwt.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => UserModule),
    forwardRef(() => GlobalJwtModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthHelper],
  exports: [AuthHelper],
})
export class AuthModule {}
