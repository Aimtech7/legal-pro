import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true, maxlength: 50 })
  firstName!: string;

  @Prop({ required: true, trim: true, maxlength: 50 })
  lastName!: string;

  @Prop({ 
    required: true, 
    unique: true, 
    lowercase: true,
    match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
  })
  email!: string;

  @Prop({ required: true, minlength: 6, select: false })
  password!: string;

  @Prop({ enum: ['advocate', 'admin', 'client'], default: 'client' })
  role!: string;

  @Prop({
    type: {
      canOpenFiles: { type: Boolean, default: false },
      canUploadFiles: { type: Boolean, default: false },
      canAdmitClients: { type: Boolean, default: false },
      canManageCases: { type: Boolean, default: false },
      canScheduleAppointments: { type: Boolean, default: false },
      canAccessReports: { type: Boolean, default: false },
    },
    default: {}
  })
  permissions!: {
    canOpenFiles: boolean;
    canUploadFiles: boolean;
    canAdmitClients: boolean;
    canManageCases: boolean;
    canScheduleAppointments: boolean;
    canAccessReports: boolean;
  };

  @Prop({ default: true })
  isVerified!: boolean;

  @Prop({ default: true })
  isActive!: boolean;

  @Prop()
  lastLogin?: Date;

  @Prop({ default: false })
  isTemporaryPassword!: boolean;

  @Prop({ default: false })
  isEmailVerified!: boolean;

  async matchPassword(enteredPassword: string): Promise<boolean> {
    return bcrypt.compare(enteredPassword, this.password);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function(enteredPassword: string): Promise<boolean> {
  return bcrypt.compare(enteredPassword, this.password);
};