import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { NotificationStatus, NotificationType } from '@/modules/notification/contant';


@Schema({ timestamps: true })
export class Notification {
  @Prop({ index: true })
  type: NotificationType;

  @Prop({})
  content: string;

  @Prop({ type: 'ObjectId', ref: 'User' })
  owner: string;

  @Prop({ default: true })
  isGlobal: boolean;

  @Prop({ default: '' })
  to: string;

  @Prop({ default: '' })
  hrefId: string;
}

export type NotificationDocument = Notification & Document;
export const NotificationSchema = SchemaFactory.createForClass(Notification);

NotificationSchema.index({ updatedAt: -1 });
