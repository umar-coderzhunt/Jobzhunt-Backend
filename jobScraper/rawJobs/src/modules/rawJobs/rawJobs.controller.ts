import { Controller, Post, Body, Res, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RawJobsService } from './rawJobs.service';
import { SearchJobsDto } from './dto/searchJobs.dto';
import {
  errorResponse,
  successResponse,
} from 'src/shared/utils/response.utils';
import { Roles } from 'src/shared/decorators/usersRole.decorator';
import { RolesGuard } from 'src/shared/guards/userRolesGuard.guard';
import { JwtAuthGuard } from 'src/shared/guards/jwtAuthGuard.guard';
import { UserRole } from 'src/shared/enums/usersRoles.enum';
import { RawJobsCronService } from './rawJobs.cron';

@ApiBearerAuth()
@ApiTags('Raw Jobs')
@Controller('raw-jobs')
export class RawJobsController {
  constructor(
    private readonly rawJobsService: RawJobsService,
    private readonly rawJobsCronService: RawJobsCronService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles([UserRole.SUPER_ADMIN, UserRole.ADMIN])
  @ApiOperation({ summary: 'Search and store jobs from LinkedIn' })
  @ApiResponse({
    status: 200,
    description: 'Jobs found and stored successfully',
  })
  async fetchJobs(@Body() searchParams: SearchJobsDto, @Res() res: Response) {
    try {
      await this.rawJobsService.fetchJobs(searchParams);
      successResponse(res, 'Jobs found and stored successfully');
    } catch (error) {
      errorResponse(res, error);
    }
  }
}
