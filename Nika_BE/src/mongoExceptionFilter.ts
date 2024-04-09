import { Response } from 'express';
import { MongoError } from 'mongodb';
import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(MongoExceptionFilter.name);

  catch(exception: MongoError, host: ArgumentsHost) {
    this.logger.error(exception);
    return host
      .switchToHttp()
      .getResponse<Response>()
      .status(500)
      .send({ message: 'Internal Server Error' });
  }
}
