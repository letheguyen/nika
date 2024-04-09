import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';


@Schema({ timestamps: true })
export class Blog {

  @Prop({ index: true })
  description: string;

  @Prop({ default: [] })
  images: string[];

  @Prop({ type: 'ObjectId', ref: 'User'})
  ownerId: string
}

export type BlogDocument = Blog & Document;
export const BlogSchema = SchemaFactory.createForClass(Blog);

BlogSchema.index({ updatedAt: -1 });
