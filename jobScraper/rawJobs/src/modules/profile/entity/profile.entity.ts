import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export enum Degree {
  BACHELOR = 'Bachelor',
  MASTER = 'Master',
}

export enum FieldOfStudy {
  COMPUTER_SCIENCE = 'Computer Science',
  SOFTWARE_ENGINEERING = 'Software Engineering',
  DATA_SCIENCE = 'Data Science',
  ARTIFICIAL_INTELLIGENCE = 'Artificial Intelligence',
  MACHINE_LEARNING = 'Machine Learning',
  INFORMATION_TECHNOLOGY = 'Information Technology',
}

export enum Category {
  FRONTEND = 'Frontend',
  BACKEND = 'Backend',
  CLOUD = 'Cloud',
  DATABASE = 'Database',
  DEVOPS = 'DevOps',
  ARCHITECTURE = 'Architecture',
  TESTING = 'Testing',
  TOOLS = 'Tools',
}

export enum Status {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  HOLD = 'Hold',
}

@Schema({ _id: false })
export class Education {
  @Prop({ type: String, enum: Degree, required: true })
  degree: Degree;

  @Prop({ type: String, enum: FieldOfStudy, required: true })
  fieldOfStudy: FieldOfStudy;

  @Prop()
  grade: string;

  @Prop({ required: true })
  instituteName: string;

  @Prop()
  startYear: number;

  @Prop()
  endYear: number;
}
export const EducationSchema = SchemaFactory.createForClass(Education);

@Schema({ _id: false })
export class Experience {
  @Prop({ required: true })
  companyName: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  location: string;

  @Prop()
  startDate: string;

  @Prop()
  endDate: string;

  @Prop()
  description: string;

  @Prop({ default: false })
  isCurrent: boolean;
}
export const ExperienceSchema = SchemaFactory.createForClass(Experience);

@Schema({ _id: false })
export class Skill {
  @Prop({ type: [String], default: [] })
  technologies: string[];

  @Prop({ type: String, enum: Category, required: true })
  category: Category;
}
export const SkillSchema = SchemaFactory.createForClass(Skill);

@Schema({
  timestamps: true,
  collection: 'profiles',
})
export class Profile extends Document {
  @Prop({ required: true, type: String })
  firstName: string;

  @Prop({ required: true, type: String })
  lastName: string;

  @Prop({ required: true, type: String })
  email: string;

  @Prop({ required: true, type: String })
  phoneNumber: string;

  @Prop({ type: String })
  address: string;

  @Prop({ type: String })
  city: string;

  @Prop({ type: String })
  state: string;

  @Prop({ type: String })
  linkedinUrl: string;

  @Prop({ type: String, required: true })
  birthDate: string;

  @Prop({ type: [EducationSchema], default: [] })
  education: Education[];

  @Prop({ type: [ExperienceSchema], default: [] })
  experience: Experience[];

  @Prop({ type: [SkillSchema], default: [] })
  skills: Skill[];

  @Prop({ type: [String], default: [] })
  scope: string[];

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'User', default: [] })
  businessDevelopers: Types.ObjectId[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  technicalDeveloper: Types.ObjectId;

  @Prop({ type: String, enum: Status, default: Status.INACTIVE })
  status: Status;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
