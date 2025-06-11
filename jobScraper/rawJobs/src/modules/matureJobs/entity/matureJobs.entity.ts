import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Prop } from '@nestjs/mongoose';
import { Document, Schema as MongoSchema, Types } from 'mongoose';
import { SourceType } from '../constants/matureJobs.constants';

@Schema({
  timestamps: true,
  collection: 'matureJobs',
})
export class MatureJob extends Document {
  @Prop({ type: MongoSchema.Types.ObjectId, ref: 'RawJob' })
  rawJob: Types.ObjectId;

  @Prop({ required: true })
  source: SourceType;

  @Prop({ required: false })
  url: string;

  @Prop({ required: false })
  email: string;

  @Prop({ required: false, default: false })
  isApplied: boolean;

  @Prop({ required: false, default: true })
  isRelevant: boolean;

  @Prop({ type: [MongoSchema.Types.ObjectId], ref: 'Profile' })
  appliedBy: Types.ObjectId[];
}

export const MatureJobSchema = SchemaFactory.createForClass(MatureJob);
