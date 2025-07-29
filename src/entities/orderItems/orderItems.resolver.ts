import {
  Resolver,
  ResolveField,
  Args,
  Parent,
  Mutation,
} from '@nestjs/graphql';
import { BaseResolver } from 'src/common/base.resolver';
import {
  CreateOrderItemsWithOrderIdInput,
  OrderItemsService,
} from './orderItems.service';
import { OrderItems } from './orderItems.entity';
import { UpdateOrderItemsDto } from './orderItems.schema';
import { CurrentUser, AuthUser } from 'src/decorators/currentUser.decorator';
import { OrderService } from '../order/order.service';
import { ProductService } from '../product/product.service';
import { ProductType } from '../product/product.types';
import { OrderType } from '../order/order.types';

@Resolver(() => OrderItems)
export class OrderItemsController extends BaseResolver<OrderItems> {
  constructor(
    protected readonly orderItemsService: OrderItemsService,
    private readonly orderService: OrderService,
    private readonly productService: ProductService,
  ) {
    super(orderItemsService);
  }
  @Mutation()
  create(
    @CurrentUser() user: AuthUser,
    @Args('input') dto: CreateOrderItemsWithOrderIdInput,
  ) {
    return this.orderItemsService.create(user, dto);
  }

  @Mutation(':id')
  update(
    @CurrentUser() user: AuthUser,
    @Args('id') id: string,
    @Args('input') dto: UpdateOrderItemsDto,
  ) {
    return this.orderItemsService.update(user, id, dto);
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
