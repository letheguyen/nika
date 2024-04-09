import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { Blog, BlogSchema } from '@/models/blog';
import { UserModule } from 'module/user/user.module';
import { GatewayModule } from 'module/gateway/gateway.module';
import { Notification, NotificationSchema } from '@/models/notification';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Blog.name,
        schema: BlogSchema,
      },
      {
        name: Notification.name,
        schema: NotificationSchema,
      },
    ]),
    UserModule,
    GatewayModule
  ],
  controllers: [BlogController],
  providers: [BlogService],
  exports: [BlogService],
})
export class BlogModule {}
