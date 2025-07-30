import { Resolver } from '@nestjs/graphql';
import { BaseService } from './base.service';
import { BaseType } from './baseType.types';
import { AuthUser } from 'src/decorators/currentUser.decorator';

@Resolver()
export abstract class BaseResolver<T extends BaseType> {
  constructor(protected readonly service: BaseService<T>) {}

  getAll(user: AuthUser): Promise<T[]> {
    console.log('user in base resolver', user);
    return this.service.getAll(user.companyId);
  }

  getById(user: AuthUser, id: string): Promise<T> {
    return this.service.getById(id, user.companyId);
  }

  async delete(user: AuthUser, id: string): Promise<boolean> {
    const result = await this.service.delete(id, user.companyId);
    return (result.affected ?? 0) > 0;
  }

  async softDelete(user: AuthUser, id: string): Promise<boolean> {
    const result = await this.service.softDelete(id, user.companyId);
    return (result.affected ?? 0) > 0;
  }
}
