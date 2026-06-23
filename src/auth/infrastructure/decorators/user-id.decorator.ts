import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

interface CustomRequest extends Request {
  user?: {
    id: string;
  };
}

export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<CustomRequest>();
    return request.user?.id || '';
  },
);
