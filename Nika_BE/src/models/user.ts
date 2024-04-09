import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { IUser } from 'module/user/interfaces/interface';
import { DEFAULT_USER_NONCE, REGEX_VALIDATOR, Role, USER_STATUS } from 'module/user/contants/constants';

@Schema({ timestamps: true })
export class User implements IUser {

  @Prop({ lowercase: true, match: REGEX_VALIDATOR.EMAIL, index: true })
  email: string;

  @Prop({ default: '' })
  password: string;

  @Prop({ default: Role.User, index: true })
  role: Role;

  @Prop({ default: '' })
  userName: string;

  @Prop({ default: '' })
  avatarUrl: string;

  @Prop({ default: USER_STATUS.BLOCKED })
  status: USER_STATUS;

  @Prop({ default: true })
  isUpdatedPassword: boolean;

  @Prop({ default: DEFAULT_USER_NONCE })
  nonce: number;

  @Prop({ default: '' })
  token: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ updatedAt: -1 });
