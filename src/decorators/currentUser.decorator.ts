import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export interface AuthUser {
  id: string;
  username: string;
  companyId: string;
  role: string;
}

export const CurrentUser = createParamDecorator(
  (_, ctx: ExecutionContext): AuthUser => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user: AuthUser }>();
    return request.user;
  },
);
