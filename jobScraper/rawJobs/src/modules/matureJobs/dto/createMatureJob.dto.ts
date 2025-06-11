import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsMongoId,
  IsArray,
  IsOptional,
} from 'class-validator';
import { SourceType } from '../constants/matureJobs.constants';
export class CreateMatureJobDto {
  @ApiProperty({
    type: String,
    description: 'Please provide the ID of the raw job',
    example: '682e178e7a4c983b5e184a4c',
  })
  @IsNotEmpty()
  @IsString()
  rawJob: string;

  @ApiProperty({
    type: String,
    description: 'The source of the job',
    example: 'indeed',
  })
  @IsNotEmpty()
  @IsString()
  source: SourceType;

  @ApiProperty({
    type: String,
    description: 'The URL of the job',
    example:
      'https://www.indeed.com/jobs?q=software+engineer&l=San+Francisco%2C+CA',
  })
  @IsNotEmpty()
  @IsString()
  url: string;

  @ApiProperty({
    type: String,
    description: 'The email of the job',
    example: 'john.doe@example.com',
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    type: Boolean,
    description: 'Whether the job has been applied to',
    example: false,
  })
  @IsNotEmpty()
  @IsBoolean()
  isApplied: boolean;

  @ApiProperty({
    type: [String],
    description: 'The users who have applied to the job',
    example: ['60a0fe4f5311236168a109ca', '60a0fe4f5311236168a109cb'],
    required: false,
  })
  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  appliedBy: string[];

  @ApiProperty({
    type: Boolean,
    description: 'Whether the job is relevant',
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  isRelevant: boolean;
}
