import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';

export interface AuthUser {
  id: string;
  username: string;
  companyId: string;
  role: string;
}

interface RequestWithUser extends Request {
  user: AuthUser;
}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthUser => {
    let request: RequestWithUser;

    if (ctx.getType<string>() === 'graphql') {
      const gqlContext = GqlExecutionContext.create(ctx);
      request = gqlContext.getContext<{ req: RequestWithUser }>().req;
    } else {
      request = ctx.switchToHttp().getRequest<RequestWithUser>();
    }

    return request.user;
  },
);
