import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

export class SetCookieInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const res = ctx.getResponse();

    return next.handle().pipe(
      map((data) => {
        if (data && data.accessToken) {
          res.cookie('access_token', data.accessToken, {
            httpOnly: true,
            // secure: false,
          });
          return data.user;
        }
        return data;
      }),
    );
  }
}
