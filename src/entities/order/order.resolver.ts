import { BaseResolver } from 'src/common/base.resolver';
import {
  CreateOrderInput,
  OrderService,
  UpdateOrderInput,
} from './order.service';
import { Order } from './order.entity';
import { CurrentUser, AuthUser } from 'src/decorators/currentUser.decorator';

import { InvoiceType } from '../invoice/invoice.types';
import { WarehouseType } from '../warehouse/warehouse.types';
import { PartnerType } from '../partner/partner.types';
import { CompanyType } from '../company/company.types';
import { UserType } from '../user/user.types';
import { OrderItemsType } from '../orderItems/orderItems.type';
import { InvoiceService } from '../invoice/invoice.service';
import { WarehouseService } from '../warehouse/warehouse.service';
import { PartnerService } from '../partner/partner.service';
import { UserService } from '../user/user.service';
import { OrderType } from './order.types';
import {
  ResolveField,
  Resolver,
  Args,
  Parent,
  Mutation,
} from '@nestjs/graphql';
import { CompanyService } from '../company/company.service';
import { OrderItemsService } from '../orderItems/orderItems.service';

@Resolver(() => OrderType)
export class OrderController extends BaseResolver<Order> {
  constructor(
    protected readonly orderService: OrderService,
    private readonly invoiceService: InvoiceService,
    private readonly warehouseService: WarehouseService,
    private readonly partnerService: PartnerService,
    private readonly userService: UserService,
    private readonly companyService: CompanyService,
    private readonly orderItemsService: OrderItemsService,
  ) {
    super(orderService);
  }

  @Mutation()
  create(
    @CurrentUser() user: AuthUser,
    @Args('input') input: CreateOrderInput,
  ) {
    return this.orderService.createOrderWithItems(user, input);
  }

  @Mutation(() => OrderType)
  async updateOrder(
    @CurrentUser() user: AuthUser,
    @Args('id') id: string,
    @Args('input') input: UpdateOrderInput,
  ): Promise<OrderType> {
    return await this.orderService.updateOrderWithItems(user, input, id);
  }

  @ResolveField(() => [InvoiceType])
  async invoices(@Parent() order: OrderType) {
    return this.invoiceService.findAllByOrderId(order.id);
  }

  @ResolveField(() => [OrderItemsType])
  async orderItems(@Parent() order: OrderType) {
    return this.orderItemsService.findAllByOrderId(order.id);
  }

  @ResolveField(() => UserType)
  async user(@Parent() order: OrderType) {
    return this.userService.getById(order.userId);
  }

  @ResolveField(() => CompanyType)
  async company(@Parent() order: OrderType) {
    return this.companyService.getById(order.companyId);
  }

  @ResolveField(() => WarehouseType)
  async warehouse(@Parent() order: OrderType) {
    return this.warehouseService.getById(order.warehouseId);
  }

  @ResolveField(() => PartnerType)
  async partner(@Parent() order: OrderType) {
    return this.partnerService.getById(order.partnerId);
  }
}
