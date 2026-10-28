import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface StandardResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, StandardResponse<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<StandardResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        // If the controller already returned a shaped response, pass it through
        if (data && typeof data === 'object' && typeof data.success === 'boolean' && 'data' in data) {
          return {
            ...data,
            message: data.message ?? 'Operation completed successfully',
          } as StandardResponse<T>;
        }
        return {
          success: true,
          data: data as T,
          message: 'Operation completed successfully',
        };
      }),
    );
  }
}
