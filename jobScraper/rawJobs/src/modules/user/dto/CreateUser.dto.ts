import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
  IsArray,
  Matches,
  Length,
} from 'class-validator';
import { UserRole } from 'src/shared/enums/usersRoles.enum';

export class CreateUserDto {
  @ApiProperty({
    description: 'The first name of the user',
    example: 'John',
    required: true,
  })
  @IsNotEmpty({ message: 'First name is required' })
  @IsString({ message: 'First name must be a string' })
  @Length(2, 30, { message: 'First name must be between 2 and 30 characters' })
  firstName: string;

  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe',
    required: true,
  })
  @IsNotEmpty({ message: 'Last name is required' })
  @IsString({ message: 'Last name must be a string' })
  @Length(2, 30, { message: 'Last name must be between 2 and 30 characters' })
  lastName: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'test@example.com',
    required: true,
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
    required: true,
    minLength: 8,
  })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
    },
  )
  password: string;

  @ApiProperty({
    description: 'The role of the user',
    example: 'user',
    required: false,
    default: UserRole.USER,
    enum: UserRole,
  })
  @IsEnum(UserRole, {
    message:
      'Invalid role. Must be one of: ' + Object.values(UserRole).join(', '),
  })
  role: UserRole;

  @ApiProperty({
    description: 'The designation of the user',
    example: 'Software Engineer',
    required: true,
  })
  @IsNotEmpty({ message: 'Designation is required' })
  @IsString({ message: 'Designation must be a string' })
  @Length(2, 50, { message: 'Designation must be between 2 and 50 characters' })
  designation: string;

  @ApiProperty({
    description: 'The phone number of the user',
    example: '+923456789012',
    required: false,
  })
  @IsOptional()
  @Matches(/^\+[1-9]\d{1,14}$/, {
    message: 'Invalid phone number format. Must start with + and country code',
  })
  phoneNumber?: string;

  @ApiProperty({
    description: 'The assigned profile of the user',
    example: ['profile1', 'profile2'],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  assignedProfile?: string[];
}
