import {
  Resolver,
  ResolveField,
  Args,
  Parent,
  Mutation,
  Query,
} from '@nestjs/graphql';
import { BaseResolver } from 'src/common/base.resolver';
import { OrderItemsService } from './orderItems.service';
import { OrderItems } from './orderItems.entity';
import { CurrentUser, AuthUser } from 'src/decorators/currentUser.decorator';
import { OrderService } from '../order/order.service';
import { ProductService } from '../product/product.service';
import { ProductType } from '../product/product.types';
import { OrderType } from '../order/order.types';
import {
  OrderItemsType,
  UpdateOrderItemsType,
  CreateOrderItemsWithOrderIdType,
} from './orderItems.type';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from '../user/user.entity';

@Resolver(() => OrderItemsType)
export class OrderItemsResolver extends BaseResolver<OrderItems> {
  constructor(
    protected readonly orderItemsService: OrderItemsService,
    private readonly orderService: OrderService,
    private readonly productService: ProductService,
  ) {
    super(orderItemsService);
  }

  @Query(() => [OrderItemsType], { name: 'getAllOrderItems' })
  override getAll(@CurrentUser() user: AuthUser) {
    return super.getAll(user);
  }

  @Query(() => OrderItemsType, { name: 'getOrderItemsById' })
  override getById(@CurrentUser() user: AuthUser, @Args('id') id: string) {
    return super.getById(user, id);
  }

  @Mutation(() => OrderItemsType, { name: 'createOrderItems' })
  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  create(
    @CurrentUser() user: AuthUser,
    @Args('input') dto: CreateOrderItemsWithOrderIdType,
  ): Promise<OrderItemsType> {
    return this.orderItemsService.create(user, dto);
  }

  @Mutation(() => OrderItemsType, { name: 'updateOrderItems' })
  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  update(
    @CurrentUser() user: AuthUser,
    @Args('id') id: string,
    @Args('input') dto: UpdateOrderItemsType,
  ): Promise<OrderItemsType> {
    return this.orderItemsService.update(user, id, dto);
  }

  @Mutation(() => Boolean, { name: 'deleteOrderItems' })
  @Roles(UserRole.OWNER)
  override delete(@CurrentUser() user: AuthUser, @Args('id') id: string) {
    return super.delete(user, id);
  }

  @Mutation(() => Boolean, { name: 'softDeleteOrderItems' })
  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  override softDelete(@CurrentUser() user: AuthUser, @Args('id') id: string) {
    return super.softDelete(user, id);
  }

  @ResolveField(() => OrderType)
  async order(@Parent() item: OrderItems) {
    return this.orderService.getById(item.orderId);
  }

  @ResolveField(() => ProductType)
  async product(@Parent() item: OrderItems) {
    return this.productService.getById(item.productId);
  }
}
