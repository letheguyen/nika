import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AppService } from '@/app.service';
import { AppController } from '@/app.controller';
import { UserModule } from 'module/user/user.module';
import { AuthModule } from 'module/auth/auth.module';
import { FileModule } from 'module/file/file.module';
import { BlogModule } from 'module/blog/blog.module';
import { LoggerMiddleware } from '@/middlewares/loggers';
import { GatewayModule } from 'module/gateway/gateway.module';
import { NotificationModule } from 'module/notification/notification.module';

const modules = [AuthModule, UserModule, FileModule, BlogModule, GatewayModule, NotificationModule];

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_DB_URI),
    ...modules,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
