import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsMongoId, IsOptional } from 'class-validator';

export class UpdateAppliedByDto {
  @ApiProperty({
    description: 'User IDs to add to appliedBy',
    example: ['60a0fe4f5311236168a109ca'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  add?: string[];

  @ApiProperty({
    description: 'User IDs to remove from appliedBy',
    example: ['60a0fe4f5311236168a109cb'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  remove?: string[];

  @ApiProperty({
    description: 'Flag indicating whether the job is relevant',
    example: true,
    type: Boolean,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isRelevant?: boolean;
}
