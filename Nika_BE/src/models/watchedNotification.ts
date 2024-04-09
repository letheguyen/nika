import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';


@Schema({ timestamps: true })
export class WatchedNotification {
  @Prop({ type: 'ObjectId', ref: 'User' })
  owner: string;

  @Prop({ default: {}, type: Object })
  notificationsWatched: {[notificationId: string]: string}
}

export type WatchedNotificationDocument = WatchedNotification & Document;
export const WatchedNotificationSchema = SchemaFactory.createForClass(WatchedNotification);

WatchedNotificationSchema.index({ updatedAt: -1 });
