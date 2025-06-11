import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole } from 'src/shared/enums/usersRoles.enum';

@Schema({
  timestamps: true,
  collection: 'users',
})
export class User extends Document {
  @Prop({ required: true, length: 30 })
  firstName: string;

  @Prop({ required: true, length: 30 })
  lastName: string;

  @Prop({ required: true, unique: true, length: 100 })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ length: 50 })
  designation?: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Prop({ type: [String], default: [] })
  assignedProfile: string[];

  @Prop({ type: String, default: null })
  phoneNumber?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.password;
    return ret;
  },
});
