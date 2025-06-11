import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import {
  Controller,
  Post,
  HttpStatus,
  Res,
  Body,
  UseGuards,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { CreateUserDto } from './dto/CreateUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserRole } from 'src/shared/enums/usersRoles.enum';
import { JwtAuthGuard } from 'src/shared/guards/jwtAuthGuard.guard';
import { Roles } from 'src/shared/decorators/usersRole.decorator';
import {
  errorResponse,
  successResponse,
} from 'src/shared/utils/response.utils';
import { Userctx } from 'src/shared/decorators/jwtAuthUser.decorator';
import { CurrentUser } from 'src/shared/interface/userContext.interface';
import { RolesGuard } from 'src/shared/guards/userRolesGuard.guard';

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('create')
  @Roles([UserRole.SUPER_ADMIN])
  @ApiOperation({ summary: 'Create a new user account' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The user has been successfully created.',
  })
  async createUser(@Body() user: CreateUserDto, @Res() res: Response) {
    try {
      const result = await this.userService.createUser(user);
      successResponse(res, 'User created successfully', result);
    } catch (error) {
      errorResponse(res, error);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @Roles([UserRole.SUPER_ADMIN, UserRole.ADMIN])
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The users have been successfully retrieved.',
  })
  async getAllUsers(@Res() res: Response) {
    try {
      const users = await this.userService.getAllUsers();
      successResponse(res, 'Users fetched successfully', users);
    } catch (error) {
      errorResponse(res, error);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('me')
  @Roles([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER])
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user has been successfully retrieved.',
  })
  async getCurrentUser(
    @Userctx() currentUser: CurrentUser,
    @Res() res: Response,
  ) {
    try {
      const user = await this.userService.getCurrentUser(currentUser.id);
      successResponse(res, 'User fetched successfully', user);
    } catch (error) {
      errorResponse(res, error);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  @Roles([UserRole.SUPER_ADMIN, UserRole.ADMIN])
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user has been successfully retrieved.',
  })
  async getUserById(@Param('id') id: string, @Res() res: Response) {
    try {
      const user = await this.userService.getUserById(id);
      successResponse(res, 'User fetched successfully', user);
    } catch (error) {
      errorResponse(res, error);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  @Roles([UserRole.SUPER_ADMIN])
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user has been successfully updated.',
  })
  async updateUser(
    @Param('id') id: string,
    @Body() user: UpdateUserDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.userService.updateUser(id, user);
      successResponse(res, 'User updated successfully', result);
    } catch (error) {
      errorResponse(res, error);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @Roles([UserRole.SUPER_ADMIN])
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user has been successfully deleted.',
  })
  async deleteUser(@Param('id') id: string, @Res() res: Response) {
    try {
      const user = await this.userService.deleteUser(id);
      successResponse(res, 'User deleted successfully', user);
    } catch (error) {
      errorResponse(res, error);
    }
  }
}
