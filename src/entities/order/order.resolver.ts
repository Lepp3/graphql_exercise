import { BaseResolver } from 'src/common/base.resolver';
import { OrderService } from './order.service';
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
import { OrderType, CreateOrderType, UpdateOrderType } from './order.types';
import {
  ResolveField,
  Resolver,
  Args,
  Parent,
  Mutation,
  Query,
} from '@nestjs/graphql';
import { CompanyService } from '../company/company.service';
import { OrderItemsService } from '../orderItems/orderItems.service';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from '../user/user.entity';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { CreateOrderSchema, UpdateOrderSchema } from './order.schema';

@Resolver(() => OrderType)
export class OrderResolver extends BaseResolver<Order> {
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

  @Query(() => [OrderType], { name: 'getAllOrders' })
  override getAll(@CurrentUser() user: AuthUser) {
    return super.getAll(user);
  }

  @Query(() => OrderType, { name: 'getOrderById' })
  override getById(@CurrentUser() user: AuthUser, @Args('id') id: string) {
    return super.getById(user, id);
  }

  @Mutation(() => OrderType, { name: 'createOrder' })
  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  create(
    @CurrentUser() user: AuthUser,
    @Args('input', new ZodValidationPipe(CreateOrderSchema))
    input: CreateOrderType,
  ) {
    return this.orderService.createOrderWithItems(user, input);
  }

  @Mutation(() => OrderType, { name: 'updateOrder' })
  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  async updateOrder(
    @CurrentUser() user: AuthUser,
    @Args('id') id: string,
    @Args('input', new ZodValidationPipe(UpdateOrderSchema))
    input: UpdateOrderType,
  ): Promise<OrderType> {
    return await this.orderService.updateOrderWithItems(user, input, id);
  }

  @Mutation(() => Boolean, { name: 'deleteOrder' })
  @Roles(UserRole.OWNER)
  override delete(@CurrentUser() user: AuthUser, @Args('id') id: string) {
    return super.delete(user, id);
  }

  @Mutation(() => Boolean, { name: 'softDeleteOrder' })
  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  override softDelete(@CurrentUser() user: AuthUser, @Args('id') id: string) {
    return super.softDelete(user, id);
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
