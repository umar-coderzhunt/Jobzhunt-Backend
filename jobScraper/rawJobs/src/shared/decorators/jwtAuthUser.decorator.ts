import { ExecutionContext, Logger } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';

export const Userctx = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const logger = new Logger('UserDecorator');
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      logger.error('No user found in request');
      return null;
    }

    return data ? user && user[data] : user;
  },
);
