import { Get, Delete, Param, Body, Controller } from '@nestjs/common';
import { BaseService } from './base.service';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/entities/user/user.entity';
import { DeleteResult } from 'typeorm';
import { BaseEntity } from 'src/common/base.entity';
import { AuthUser, CurrentUser } from 'src/decorators/currentUser.decorator';

@Controller()
export abstract class BaseController<T extends BaseEntity> {
  constructor(protected readonly service: BaseService<T>) {}

  @Get()
  getAll(@CurrentUser() user: AuthUser): Promise<T[]> {
    return this.service.getAll(user.companyId);
  }

  @Get(':id')
  getById(@CurrentUser() user: AuthUser, @Param('id') id: string): Promise<T> {
    return this.service.getById(id, user.companyId);
  }

  @Delete(':id/hard')
  @Roles(UserRole.OWNER)
  delete(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
  ): Promise<DeleteResult> {
    return this.service.delete(id, user.companyId);
  }

  @Delete(':id/soft')
  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  softDelete(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
  ): Promise<DeleteResult> {
    console.log('log from controller', user.companyId);
    return this.service.softDelete(id, user.companyId);
  }
}
