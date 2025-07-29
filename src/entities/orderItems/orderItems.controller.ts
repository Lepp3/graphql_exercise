import { Controller, Param, Post, Put, Body } from '@nestjs/common';
import { BaseController } from 'src/common/base.resolver';
import { CreateOrderItemsInput, OrderItemsService } from './orderItems.service';
import { OrderItems } from './orderItems.entity';
import { CreateOrderItemsDto, UpdateOrderItemsDto } from './orderItems.schema';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { CurrentUser, AuthUser } from 'src/decorators/currentUser.decorator';

@ApiBearerAuth('Authorization')
@Controller('order-items')
export class OrderItemsController extends BaseController<OrderItems> {
  constructor(protected readonly orderItemsService: OrderItemsService) {
    super(orderItemsService);
  }
  @Post()
  @ApiBody({
    type: CreateOrderItemsDto,
    examples: {
      default: {
        value: {
          productId: '',
          quantity: '',
        },
      },
    },
  })
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateOrderItemsInput) {
    return this.orderItemsService.create(user, dto);
  }

  @Put(':id')
  @ApiBody({
    type: UpdateOrderItemsDto,
    examples: {
      default: {
        value: {
          productId: '',
          quantity: '',
        },
      },
    },
  })
  update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateOrderItemsDto,
  ) {
    return this.orderItemsService.update(user, id, dto);
  }
}
