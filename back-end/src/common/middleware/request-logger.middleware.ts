import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { appendLog } from '../utils/file-logger';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const started = Date.now();
    res.on('finish', () => {
      appendLog('access', {
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        durationMs: Date.now() - started,
        role: req.headers['role'] || 'anonymous',
        ip: req.ip,
      });
    });
    next();
  }
}
