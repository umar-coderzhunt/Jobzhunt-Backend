import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Res,
  UseGuards,
  Get,
  Param,
  Query,
  Req,
  Put,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateProfileDto } from './dto/createProfile.dto';
import {
  errorResponse,
  successResponse,
} from 'src/shared/utils/response.utils';
import { JwtAuthGuard } from 'src/shared/guards/jwtAuthGuard.guard';
import { RolesGuard } from 'src/shared/guards/userRolesGuard.guard';
import { Roles } from 'src/shared/decorators/usersRole.decorator';
import { UserRole } from 'src/shared/enums/usersRoles.enum';
import { UpdateProfileDto } from './dto/updateProfile.dto';

@ApiBearerAuth()
@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles([UserRole.SUPER_ADMIN, UserRole.ADMIN])
  @ApiOperation({ summary: 'Create profile' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Profile created successfully',
  })
  async createProfile(
    @Body() createProfileDto: CreateProfileDto,
    @Res() res: Response,
  ) {
    try {
      const profile = await this.profileService.createProfile(createProfileDto);
      successResponse(res, 'Profile created successfully', profile);
    } catch (error) {
      errorResponse(res, error);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @Roles([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER])
  @ApiOperation({ summary: 'Get all profiles' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Profiles fetched successfully',
  })
  async getAllProfiles(
    @Req() req: Request,
    @Res() res: Response,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    try {
      const profiles = await this.profileService.getAllProfiles(
        req['user'],
        page,
        limit,
      );
      successResponse(res, 'Profiles fetched successfully', profiles);
    } catch (error) {
      errorResponse(res, error);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  @Roles([UserRole.SUPER_ADMIN, UserRole.ADMIN])
  @ApiOperation({ summary: 'Get profile by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Profile fetched successfully',
  })
  async getProfileById(@Param('id') id: string, @Res() res: Response) {
    try {
      const profile = await this.profileService.getProfileById(id);
      successResponse(res, 'Profile fetched successfully', profile);
    } catch (error) {
      errorResponse(res, error);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id')
  @Roles([UserRole.SUPER_ADMIN, UserRole.ADMIN])
  @ApiOperation({ summary: 'Update profile by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Profile updated successfully',
  })
  async updateProfileById(
    @Param('id') id: string,
    @Body() profileDto: UpdateProfileDto,
    @Res() res: Response,
  ) {
    try {
      const profile = await this.profileService.updateProfileById(
        id,
        profileDto,
      );
      successResponse(res, 'Profile updated successfully', profile);
    } catch (error) {
      errorResponse(res, error);
    }
  }
}
