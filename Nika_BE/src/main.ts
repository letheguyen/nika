import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';

import { AppModule } from '@/app.module';
import { MongoExceptionFilter } from '@/mongoExceptionFilter';

async function bootstrap() {
  const logger = new Logger('main.bootstrap');
  const app = await NestFactory.create(AppModule);
  app.use(helmet({}));

  app.setGlobalPrefix('api/v1/');
  app.enableCors({ origin: true })
  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalFilters(new MongoExceptionFilter());

  await app.listen(Number(process.env.PORT) || 1202);
  logger.log('Application is running on: '+(await app.getUrl()).replace("[::1]", "localhost"));
}

bootstrap();

