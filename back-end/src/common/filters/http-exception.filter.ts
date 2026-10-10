import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { appendLog } from '../utils/file-logger';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let shaped: Record<string, unknown> | null = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const resp = exceptionResponse as Record<string, unknown>;
        if (resp['success'] !== undefined) shaped = resp;
        if (Array.isArray(resp['message'])) message = (resp['message'] as string[]).join('; ');
        else if (resp['message']) message = String(resp['message']);
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    appendLog('error', {
      method: request.method,
      path: request.originalUrl,
      statusCode: status,
      role: request.headers['role'] || 'anonymous',
      message,
      stack: exception instanceof Error ? exception.stack : undefined,
    });

    response.status(status).json(shaped || { success: false, data: null, message });
  }
}
