import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { appendLog } from '../utils/file-logger';

@Injectable()
export class RouterAuditMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction): void {
    appendLog('router', {
      method: req.method,
      route: req.originalUrl,
      role: req.headers['role'] || 'anonymous',
    });
    next();
  }
}
