import {
  Resolver,
  Mutation,
  Args,
  Parent,
  ResolveField,
} from '@nestjs/graphql';
import { CompanyType } from './company.types';
import { CompanyService } from './company.service';
import { UpdateCompanyDto } from './company.schema';
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

// @ApiBearerAuth('Authorization')
@Resolver(() => CompanyType)
export class CompanyController extends BaseResolver<CompanyType> {
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

  @Mutation(() => CompanyType)
  async updateCompany(
    @CurrentUser() user: AuthUser,
    @Args('id') id: string,
    @Args('input') input: UpdateCompanyDto,
  ): Promise<CompanyType> {
    return await this.companyService.update(user, id, input);
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
