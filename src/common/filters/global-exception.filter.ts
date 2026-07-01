import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message:
        exception instanceof HttpException
          ? exception.getResponse()
          : exception.message || 'Internal server error',
    };

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      // Log the full stack trace for internal server errors
      this.logger.error(
        `${request.method} ${request.url}`,
        exception.stack,
      );
    } else {
      // Log standard HTTP exceptions as warnings or simple logs
      this.logger.warn(
        `${request.method} ${request.url} - Status: ${status} - Error: ${JSON.stringify(errorResponse.message)}`,
      );
    }

    response.status(status).json(errorResponse);
  }
}
