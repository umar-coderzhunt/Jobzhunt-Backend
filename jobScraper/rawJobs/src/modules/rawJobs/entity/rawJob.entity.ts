import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
  collection: 'rawJobs',
})
export class RawJob extends Document {
  @Prop({ required: true })
  position: string;

  @Prop({ required: true })
  company: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  date: string;

  @Prop()
  salary: string;

  @Prop({ required: true })
  jobUrl: string;

  @Prop()
  companyLogo: string;

  @Prop()
  agoTime: string;

  @Prop({ default: false })
  isEasyApply: boolean;

  @Prop({ default: false })
  isMatureJob: boolean;

  @Prop({ default: false })
  linkPassed: boolean;
}

export const RawJobSchema = SchemaFactory.createForClass(RawJob);
