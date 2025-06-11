import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsEnum,
  IsOptional,
  ArrayNotEmpty,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import {
  Degree,
  FieldOfStudy,
  Category,
  Status,
} from '../entity/profile.entity';

export class EducationDto {
  @ApiProperty({
    description: 'The degree of the education',
    example: 'Bachelor',
    enum: Degree,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(Degree)
  degree: Degree;

  @ApiProperty({
    description: 'The field of study of the education',
    example: 'Computer Science',
    enum: FieldOfStudy,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(FieldOfStudy)
  fieldOfStudy: FieldOfStudy;

  @ApiProperty({
    description: 'The grade of the education',
    example: 'A',
    required: false,
  })
  @IsOptional()
  @IsString()
  grade?: string;

  @ApiProperty({
    description: 'The institute name of the education',
    example: 'University of California, Berkeley',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  instituteName: string;

  @ApiProperty({
    description: 'The start year of the education',
    example: 2018,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  startYear?: number;

  @ApiProperty({
    description: 'The end year of the education',
    example: 2022,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  endYear?: number;
}

export class SkillDto {
  @ApiProperty({
    description: 'The name of the skill',
    example: ['JavaScript', 'TypeScript'],
    required: true,
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  technologies: string[];

  @ApiProperty({
    description: 'The category of the skill',
    example: 'Frontend',
    enum: Category,
  })
  @IsEnum(Category)
  category: Category;
}

export class ExperienceDto {
  @ApiProperty({
    description: 'The name of the company',
    example: 'Google',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty({
    description: 'The title of the experience',
    example: 'Software Engineer',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'The location of the experience',
    example: 'Mountain View, CA',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({
    description: 'The start date of the experience',
    example: '2020-06-01',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({
    description: 'The end date of the experience',
    example: '2022-08-31',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({
    description: 'The description of the experience',
    example: 'Worked on…',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Whether the experience is current',
    example: false,
    required: true,
  })
  @IsBoolean()
  isCurrent: boolean;
}

export class CreateProfileDto {
  @ApiProperty({
    description: 'The first name of the profile',
    example: 'John',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'The last name of the profile',
    example: 'Doe',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'The email of the profile',
    example: 'john.doe@example.com',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'The phone number of the profile',
    example: '+1234567890',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    description: 'The address of the profile',
    example: '123 Main St, Anytown, USA',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'The city of the profile',
    example: 'Anytown',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    description: 'The state of the profile',
    example: 'California',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({
    description: 'The linkedin url of the profile',
    example: 'https://www.linkedin.com/in/john-doe',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  linkedinUrl: string;

  @ApiProperty({
    description: 'The birth date of the profile',
    example: '1990-01-01',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  birthDate: string;

  @ApiProperty({
    description: 'The education of the profile',
    example: [
      {
        degree: 'Bachelor',
        fieldOfStudy: 'Computer Science',
        instituteName: 'University of California, Berkeley',
        startYear: 2018,
        endYear: 2022,
        grade: 'A',
      },
    ],
  })
  @IsArray({ each: true })
  education: EducationDto[];

  @ApiProperty({
    description: 'The experience of the profile',
    example: [
      {
        companyName: 'Google',
        title: 'Software Engineer',
        location: 'San Francisco, CA',
        startDate: '2020-01-01',
        endDate: '2022-01-01',
        description: 'Developed and maintained software applications',
        isCurrent: false,
      },
    ],
  })
  @IsArray({ each: true })
  experience: ExperienceDto[];

  @ApiProperty({
    description: 'The skills of the profile',
    example: [
      { technologies: ['JavaScript', 'React'], category: 'Frontend' },
      { technologies: ['Node.js', 'Express'], category: 'Backend' },
    ],
  })
  @IsArray({ each: true })
  skills: SkillDto[];

  @ApiProperty({
    description: 'The scope of the profile',
    example: ['Frontend', 'Backend', 'Full Stack'],
    required: true,
  })
  @IsArray()
  @IsString({ each: true })
  scope: string[];

  @ApiProperty({
    description: 'The user ids of the business developers',
    example: ['615f1bd5c8a2b45f2c8e9a12', '615f1bd5c8a2b45f2c8e9a13'],
    required: true,
  })
  @IsArray()
  @IsString({ each: true })
  businessDevelopers: string[];

  @ApiProperty({
    description: 'The user id of the technical developer',
    example: '615f1bd5c8a2b45f2c8e9a12',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  technicalDeveloper: string;

  @ApiProperty({
    description: 'The status of the profile',
    example: 'Active',
    required: true,
  })
  @IsEnum(Status)
  status: Status;
}
