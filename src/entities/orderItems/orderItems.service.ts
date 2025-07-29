import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { OrderItems } from './orderItems.entity';
import { BaseService } from 'src/common/base.service';
import { z } from 'zod';
import {
  CreateOrderItemsSchema,
  CreateOrderItemsWithOrderIdSchema,
  UpdateOrderItemsSchema,
} from './orderItems.schema';
import { AuthUser } from 'src/decorators/currentUser.decorator';
import { OrderService } from '../order/order.service';

export type CreateOrderItemsInput = z.infer<typeof CreateOrderItemsSchema>;
export type CreateOrderItemsWithOrderIdInput = z.infer<
  typeof CreateOrderItemsWithOrderIdSchema
>;
export type UpdateOrderItemsInput = z.infer<typeof UpdateOrderItemsSchema>;

@Injectable()
export class OrderItemsService extends BaseService<OrderItems> {
  constructor(
    @InjectRepository(OrderItems) repo: Repository<OrderItems>,
    private readonly orderService: OrderService,
  ) {
    super(repo);
  }

  async findAllByOrderId(orderId: string): Promise<OrderItems[]> {
    return this.repo.find({
      where: { orderId },
    } as FindManyOptions<OrderItems>);
  }

  async create(user: AuthUser, dto: CreateOrderItemsWithOrderIdInput) {
    await this.orderService.getById(dto.orderId, user.companyId);
    const orderItem = this.repo.create({
      ...dto,
      quantity: dto.quantity.toFixed(2),
    });
    return this.repo.save(orderItem);
  }

  async update(user: AuthUser, id: string, dto: UpdateOrderItemsInput) {
    const record = await this.getById(id);
    Object.assign(record, dto);
    record.modifiedBy = user.id;
    return this.repo.save(record);
  }
}
