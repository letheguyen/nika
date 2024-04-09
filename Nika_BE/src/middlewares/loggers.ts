import { NextFunction, Request, Response } from 'express';
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('Logger Middleware');

  use(req: Request, res: Response, next: NextFunction) {
    const { body, method, query, originalUrl } = req;
    const dataReq = { method, body: body, query: query, originalUrl };
    this.logger.log(JSON.stringify(dataReq));
    next();
  }
}
