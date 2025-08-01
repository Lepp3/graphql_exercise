import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/entities/user/user.entity';
import { GqlExecutionContext } from '@nestjs/graphql';
import { RequestWithUser } from 'src/decorators/currentUser.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) return true;

    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext<{ req: RequestWithUser }>().req.user;

    if (!user || !requiredRoles.includes(user.role as UserRole)) {
      throw new ForbiddenException('Insufficient role');
    }

    return true;
  }
}
