import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
export interface StandardResponse<T> {
    success: boolean;
    data: T;
    message: string;
}
export declare class ResponseInterceptor<T> implements NestInterceptor<T, StandardResponse<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<StandardResponse<T>>;
}
