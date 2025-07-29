import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { BaseService } from './base.service';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/entities/user/user.entity';
import { BaseType } from './baseType.types';
import { AuthUser, CurrentUser } from 'src/decorators/currentUser.decorator';

@Resolver()
export abstract class BaseController<T extends BaseType> {
  constructor(protected readonly service: BaseService<T>) {}

  @Query(() => [Object])
  getAll(@CurrentUser() user: AuthUser): Promise<T[]> {
    return this.service.getAll(user.companyId);
  }

  @Query(() => Object, { name: 'getById' })
  getById(@CurrentUser() user: AuthUser, @Args('id') id: string): Promise<T> {
    return this.service.getById(id, user.companyId);
  }

  @Mutation(() => Boolean)
  @Roles(UserRole.OWNER)
  async delete(
    @CurrentUser() user: AuthUser,
    @Args('id') id: string,
  ): Promise<boolean> {
    const result = await this.service.delete(id, user.companyId);
    return (result.affected ?? 0) > 0;
  }

  @Mutation(() => Boolean)
  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  async softDelete(
    @CurrentUser() user: AuthUser,
    @Args('id') id: string,
  ): Promise<boolean> {
    const result = await this.service.softDelete(id, user.companyId);
    return (result.affected ?? 0) > 0;
  }
}
