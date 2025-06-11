import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SearchJobsDto {
  @ApiProperty({
    description: 'Keyword to search for jobs',
    example: 'React Developer',
  })
  @IsString()
  keyword: string;

  @ApiProperty({ description: 'Job location', example: 'United States' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ description: 'Date since posted', example: '24hr' })
  @IsString()
  @IsOptional()
  dateSincePosted?: string;

  @ApiProperty({ description: 'Job type', example: 'full time' })
  @IsString()
  @IsOptional()
  jobType?: string;

  @ApiProperty({ description: 'Remote filter', example: 'remote' })
  @IsString()
  @IsOptional()
  remoteFilter?: string;

  @ApiProperty({ description: 'Experience level', example: 'senior' })
  @IsString()
  @IsOptional()
  experienceLevel?: string;

  @ApiProperty({ description: 'Sort by', example: 'recent' })
  @IsString()
  @IsOptional()
  sortBy?: string;

  @ApiProperty({ description: 'Page number', example: '0' })
  @IsString()
  @IsOptional()
  page?: string;
}
