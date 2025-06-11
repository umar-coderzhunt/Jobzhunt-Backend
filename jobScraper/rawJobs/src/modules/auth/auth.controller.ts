import { ApiResponse } from '@nestjs/swagger';
import { ApiBody } from '@nestjs/swagger';
import { ApiOperation } from '@nestjs/swagger';
import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import {
  errorResponse,
  successResponse,
} from 'src/shared/utils/response.utils';
import { RolesGuard } from 'src/shared/guards/userRolesGuard.guard';
import { JwtAuthGuard } from 'src/shared/guards/jwtAuthGuard.guard';
import { Roles } from 'src/shared/decorators/usersRole.decorator';
import { UserRole } from 'src/shared/enums/usersRoles.enum';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { CurrentUser } from 'src/shared/interface/userContext.interface';
import { Userctx } from 'src/shared/decorators/jwtAuthUser.decorator';

@ApiBearerAuth()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login a user account' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user has been successfully logged in.',
  })
  async login(@Body() user: LoginDto, @Res() res: Response) {
    try {
      const result = await this.authService.login(user);
      successResponse(res, 'User logged in successfully', result);
    } catch (error) {
      errorResponse(res, error);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('reset-password')
  @Roles([UserRole.SUPER_ADMIN])
  @ApiOperation({ summary: 'Reset a user password' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user has successfully reset password.',
  })
  async resetPassword(
    @Body() user: ResetPasswordDto,
    @Res() res: Response,
    @Userctx() currentUser: CurrentUser,
  ) {
    try {
      const result = await this.authService.resetPassword(user, currentUser);
      successResponse(res, 'User reset password successfully', result);
    } catch (error) {
      errorResponse(res, error);
    }
  }
}
