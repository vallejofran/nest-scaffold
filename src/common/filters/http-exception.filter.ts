import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common'

@Catch() // Puedes especificar qué tipo de excepción manejar, si omites se manejan todas las excepciones
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()

    const status = exception.getStatus ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

    // Extraer el mensaje
    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : exception.message || 'Internal server error'

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: typeof message === 'string' ? message : message['message']
    })
  }
}
