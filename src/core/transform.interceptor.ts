import { Reflector } from '@nestjs/core';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RESPONE_MESSAGE_KEY } from 'src/decorator/customize';

export interface Response<T> {
  statusCode: number;
  message: string;
  data: object;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => ({
        statusCode: context.switchToHttp().getResponse().statusCode,
        message:
          this.reflector.getAllAndOverride<string>(RESPONE_MESSAGE_KEY, [
            context.getHandler(),
            context.getClass(),
          ]) || '',
        data: data,
      })),
    );
  }
}
