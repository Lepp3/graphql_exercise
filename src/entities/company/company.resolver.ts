import {
  Resolver,
  Mutation,
  Args,
  Parent,
  ResolveField,
  Query,
} from '@nestjs/graphql';
import { CompanyType, UpdateCompanyType } from './company.types';
import { CompanyService } from './company.service';
import { BaseResolver } from 'src/common/base.resolver';
import { CurrentUser, AuthUser } from 'src/decorators/currentUser.decorator';
import { UserService } from '../user/user.service';
import { PartnerService } from '../partner/partner.service';
import { WarehouseService } from '../warehouse/warehouse.service';
import { ProductService } from '../product/product.service';
import { OrderService } from '../order/order.service';
import { UserType } from '../user/user.types';
import { OrderType } from '../order/order.types';
import { PartnerType } from '../partner/partner.types';
import { WarehouseType } from '../warehouse/warehouse.types';
import { ProductType } from '../product/product.types';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from '../user/user.entity';

@Resolver(() => CompanyType)
export class CompanyResolver extends BaseResolver<CompanyType> {
  constructor(
    protected readonly companyService: CompanyService,
    private readonly userService: UserService,
    private readonly partnerService: PartnerService,
    private readonly warehouseService: WarehouseService,
    private readonly productService: ProductService,
    private readonly orderService: OrderService,
  ) {
    super(companyService);
  }

  // @Query(() => [CompanyType], { name: 'getAllCompanies' })
  // override getAll(@CurrentUser() user: AuthUser) {
  //   return super.getAll(user);
  // }

  @Query(() => CompanyType, { name: 'getCompanyById' })
  override getById(@CurrentUser() user: AuthUser, @Args('id') id: string) {
    return super.getById(user, id);
  }

  @Mutation(() => CompanyType, { name: 'updateCompany' })
  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  async updateCompany(
    @CurrentUser() user: AuthUser,
    @Args('id') id: string,
    @Args('input') input: UpdateCompanyType,
  ): Promise<CompanyType> {
    return await this.companyService.update(user, id, input);
  }

  @Mutation(() => Boolean, { name: 'softDeleteCompany' })
  @Roles(UserRole.OWNER)
  override delete(@CurrentUser() user: AuthUser, @Args('id') id: string) {
    return super.delete(user, id);
  }

  @Mutation(() => Boolean, { name: 'deleteCompany' })
  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  override softDelete(@CurrentUser() user: AuthUser, @Args('id') id: string) {
    return super.softDelete(user, id);
  }

  @ResolveField(() => [UserType])
  async users(@Parent() company: CompanyType) {
    return await this.userService.getByCompanyId(company.id);
  }

  @ResolveField(() => [PartnerType])
  async partners(@Parent() company: CompanyType) {
    return await this.partnerService.getByCompanyId(company.id);
  }

  @ResolveField(() => [WarehouseType])
  async warehouses(@Parent() company: CompanyType) {
    return await this.warehouseService.getByCompanyId(company.id);
  }

  @ResolveField(() => [ProductType])
  async products(@Parent() company: CompanyType) {
    return await this.productService.getByCompanyId(company.id);
  }

  @ResolveField(() => [OrderType])
  async orders(@Parent() company: CompanyType) {
    return await this.orderService.getByCompanyId(company.id);
  }
}
