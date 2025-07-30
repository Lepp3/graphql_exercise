import {
  Resolver,
  Mutation,
  Args,
  Query,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { BaseResolver } from 'src/common/base.resolver';
import { CreateWarehouseInput, WarehouseService } from './warehouse.service';
import { UpdateWarehouseDto } from './warehouse.schema';
import { HighestStockPerWarehouseType, WarehouseType } from './warehouse.types';
import { CurrentUser, AuthUser } from 'src/decorators/currentUser.decorator';
import { CompanyService } from '../company/company.service';
import { CompanyType } from '../company/company.types';
import { OrderService } from '../order/order.service';
import { OrderType } from '../order/order.types';

@Resolver(() => WarehouseType)
export class WarehouseResolver extends BaseResolver<WarehouseType> {
  constructor(
    protected readonly warehouseService: WarehouseService,
    private readonly companyService: CompanyService,
    private readonly orderService: OrderService,
  ) {
    super(warehouseService);
  }

  @Query(() => [HighestStockPerWarehouseType])
  async highestStock(): Promise<HighestStockPerWarehouseType[]> {
    return this.warehouseService.getHighestStockPerWarehouse();
  }

  @Mutation(() => WarehouseType)
  async createWarehouse(
    @CurrentUser() user: AuthUser,
    @Args('input') input: CreateWarehouseInput,
  ): Promise<WarehouseType> {
    return await this.warehouseService.create(user, input);
  }

  @Mutation(() => WarehouseType)
  async updateWarehouse(
    @CurrentUser() user: AuthUser,
    @Args('id') id: string,
    @Args('input') input: UpdateWarehouseDto,
  ): Promise<WarehouseType> {
    return this.warehouseService.update(user, id, input);
  }

  @ResolveField(() => CompanyType)
  async company(@Parent() warehouse: WarehouseType): Promise<CompanyType> {
    return this.companyService.getById(warehouse.companyId);
  }

  @ResolveField(() => [OrderType])
  async orders(@Parent() warehouse: WarehouseType): Promise<OrderType[]> {
    return this.orderService.findByWarehouseId(warehouse.id);
  }
}
