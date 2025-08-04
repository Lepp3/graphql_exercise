import {
  Resolver,
  Mutation,
  Args,
  Query,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { BaseResolver } from 'src/common/base.resolver';
import { WarehouseService } from './warehouse.service';
import {
  HighestStockPerWarehouseType,
  WarehouseType,
  CreateWarehouseType,
  UpdateWarehouseType,
  StockLevelType,
} from './warehouse.types';
import { CurrentUser, AuthUser } from 'src/decorators/currentUser.decorator';
import { CompanyService } from '../company/company.service';
import { CompanyType } from '../company/company.types';
import { OrderService } from '../order/order.service';
import { OrderType } from '../order/order.types';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from '../user/user.entity';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import {
  CreateWarehouseSchema,
  UpdateWarehouseSchema,
} from './warehouse.schema';

@Resolver(() => WarehouseType)
export class WarehouseResolver extends BaseResolver<WarehouseType> {
  constructor(
    protected readonly warehouseService: WarehouseService,
    private readonly companyService: CompanyService,
    private readonly orderService: OrderService,
  ) {
    super(warehouseService);
  }

  @Query(() => [HighestStockPerWarehouseType], { name: 'highestStock' })
  async highestStock(
    @CurrentUser() user: AuthUser,
  ): Promise<HighestStockPerWarehouseType[]> {
    return this.warehouseService.getHighestStockPerWarehouse(user.companyId);
  }

  @Query(() => [WarehouseType], { name: 'getAllWarehouses' })
  override getAll(@CurrentUser() user: AuthUser) {
    return super.getAll(user);
  }

  @Query(() => WarehouseType, { name: 'getWarehouseById' })
  override getById(@CurrentUser() user: AuthUser, @Args('id') id: string) {
    return super.getById(user, id);
  }

  @Mutation(() => WarehouseType, { name: 'createWarehouse' })
  async createWarehouse(
    @CurrentUser() user: AuthUser,
    @Args('input', new ZodValidationPipe(CreateWarehouseSchema))
    input: CreateWarehouseType,
  ): Promise<WarehouseType> {
    return await this.warehouseService.create(user, input);
  }

  @Mutation(() => WarehouseType, { name: 'updateWarehouse' })
  async updateWarehouse(
    @CurrentUser() user: AuthUser,
    @Args('id') id: string,
    @Args('input', new ZodValidationPipe(UpdateWarehouseSchema))
    input: UpdateWarehouseType,
  ): Promise<WarehouseType> {
    return this.warehouseService.update(user, id, input);
  }

  @Mutation(() => Boolean, { name: 'deleteWarehouse' })
  @Roles(UserRole.OWNER)
  override delete(@CurrentUser() user: AuthUser, @Args('id') id: string) {
    return super.delete(user, id);
  }

  @Mutation(() => Boolean, { name: 'softDeleteWarehouse' })
  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  override softDelete(@CurrentUser() user: AuthUser, @Args('id') id: string) {
    return super.softDelete(user, id);
  }

  @ResolveField(() => CompanyType)
  async company(@Parent() warehouse: WarehouseType): Promise<CompanyType> {
    return this.companyService.getById(warehouse.companyId);
  }

  @ResolveField(() => [OrderType])
  async orders(@Parent() warehouse: WarehouseType): Promise<OrderType[]> {
    return this.orderService.findByWarehouseId(warehouse.id);
  }

  @ResolveField(() => [StockLevelType], { name: 'stockLevels' })
  async stockLevels(
    @Parent() warehouse: WarehouseType,
  ): Promise<StockLevelType[]> {
    return this.orderService.getStockLevelsByWarehouse(warehouse.id);
  }
}
