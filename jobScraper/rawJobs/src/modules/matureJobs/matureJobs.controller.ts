import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateMatureJobDto } from './dto/createMatureJob.dto';
import {
  successResponse,
  errorResponse,
} from 'src/shared/utils/response.utils';
import {
  Controller,
  HttpStatus,
  Post,
  Get,
  Res,
  Body,
  Query,
  Patch,
  Param,
} from '@nestjs/common';
import { MatureJobsService } from './matureJobs.service';
import { UpdateAppliedByDto } from './dto/updateAppliedBy.dto';
@ApiBearerAuth()
@ApiTags('Mature Jobs')
@Controller('mature-jobs')
export class MatureJobsController {
  constructor(private readonly matureJobsService: MatureJobsService) {}

  @Post('create')
  @ApiOperation({ summary: 'Add a new mature job' })
  @ApiBody({ type: CreateMatureJobDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The mature job has been successfully created.',
  })
  async createMatureJob(
    @Body() matureJob: CreateMatureJobDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.matureJobsService.createMatureJob(matureJob);
      successResponse(res, 'Mature job created successfully', result);
    } catch (error) {
      errorResponse(res, error);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all mature jobs' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The mature jobs have been successfully retrieved.',
  })
  async getAllMatureJobs(
    @Res() res: Response,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    try {
      const result = await this.matureJobsService.getAllMatureJobs(page, limit);
      successResponse(res, 'Mature jobs retrieved successfully', result);
    } catch (error) {
      errorResponse(res, error);
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Add Or Remove appliedBy' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The appliedBy has been successfully updated.',
  })
  async updateAppliedBy(
    @Param('id') id: string,
    @Res() res: Response,
    @Body() appliedBy: UpdateAppliedByDto,
  ) {
    try {
      const result = await this.matureJobsService.updateAppliedBy(
        id,
        appliedBy,
      );
      successResponse(res, 'AppliedBy updated successfully', result);
    } catch (error) {
      errorResponse(res, error);
    }
  }
}
