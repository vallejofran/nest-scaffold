import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap, map } from 'rxjs/operators'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...')

    const now = Date.now()
    return next.handle().pipe(
      map((data) => {
        console.log(`After... ${Date.now() - now}ms`)
        return {
          success: true,
          data, // Enviamos la respuesta original dentro de un objeto
          timestamp: new Date().toISOString(),
        }
      })
    )

    // return next.handle().pipe(tap(() => console.log(`After... ${Date.now() - now}ms`)))
  }
}
