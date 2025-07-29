import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { Order, OrderType } from './order.entity';
import { BaseService } from 'src/common/base.service';
import { z } from 'zod';
import { CreateOrderSchema, UpdateOrderSchema } from './order.schema';
import { AuthUser } from 'src/decorators/currentUser.decorator';
import { OrderItems } from '../orderItems/orderItems.entity';
import { WarehouseService } from '../warehouse/warehouse.service';
import { PartnerService } from '../partner/partner.service';
import { PartnerType } from '../partner/partner.entity';
import { ProductService } from '../product/product.service';

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
export type UpdateOrderInput = z.infer<typeof UpdateOrderSchema>;

@Injectable()
export class OrderService extends BaseService<Order> {
  private readonly orderItemsRepo: Repository<OrderItems>;
  constructor(
    @InjectRepository(Order) repo: Repository<Order>,
    @InjectRepository(OrderItems) orderItemsRepo: Repository<OrderItems>,
    private readonly warehouseService: WarehouseService,
    private readonly partnerService: PartnerService,
    private readonly productService: ProductService,
  ) {
    super(repo);
    this.orderItemsRepo = orderItemsRepo;
  }

  async getByCompanyId(companyId: string): Promise<Order[]> {
    return this.repo.find({
      where: { companyId },
    } as FindManyOptions<Order>);
  }

  async createOrderWithItems(user: AuthUser, dto: CreateOrderInput) {
    const { items, ...orderData } = dto;
    const warehouse = await this.warehouseService.getById(
      dto.warehouseId,
      user.companyId,
    );
    const partner = await this.partnerService.getById(
      dto.partnerId,
      user.companyId,
    );
    if (
      (partner.partnerType === PartnerType.CUSTOMER &&
        dto.type === OrderType.DELIVERY) ||
      (partner.partnerType === PartnerType.SUPPLIER &&
        dto.type === OrderType.SHIPMENT)
    ) {
      return new ConflictException(
        'Partner type incompatible with order type!',
      );
    }

    const products = await Promise.all(
      items.map((item) =>
        this.productService.getById(item.productId, user.companyId),
      ),
    );

    products.forEach((product) => {
      if (product.type !== warehouse.supportType) {
        throw new ConflictException(
          `${product.name} of type ${product.type} does not match warehouse support type!`,
        );
      }
    });

    const order = this.repo.create(orderData);
    order.companyId = user.companyId;
    await this.repo.save(order);

    const orderItems = items.map((item) => ({
      ...item,
      orderId: order.id,
      quantity: item.quantity.toFixed(2),
    }));

    await this.orderItemsRepo.save(orderItems);

    return { order, items: orderItems };
  }

  async updateOrderWithItems(
    user: AuthUser,
    dto: UpdateOrderInput,
    id: string,
  ) {
    const { items, ..._orderData } = dto;

    const existingOrder = await this.getById(id, user.companyId);
    existingOrder.type = dto.type ?? existingOrder.type;
    existingOrder.partnerId = dto.partnerId ?? existingOrder.partnerId;
    existingOrder.date = dto.date ?? existingOrder.date;
    existingOrder.warehouseId = dto.warehouseId ?? existingOrder.warehouseId;
    existingOrder.companyId = user.companyId;
    existingOrder.modifiedBy = user.id;
    await this.repo.save(existingOrder);

    const existingItems = await this.orderItemsRepo.find({
      where: { orderId: id },
    });

    if (!items || !Array.isArray(items)) {
      return { order: existingOrder };
    }

    const itemsToUpdate = items.filter((item) => item.id);
    const itemsToAdd = items.filter((item) => !item.id);
    const itemsToDelete = existingItems.filter(
      (existingItem) => !items.some((i) => i.id === existingItem.id),
    );

    for (const item of itemsToUpdate) {
      await this.orderItemsRepo.update(item.id!, {
        productId: item.productId,
        quantity: item.quantity.toFixed(2),
        modifiedBy: user.id,
      });
    }

    if (itemsToAdd.length) {
      const newItems = itemsToAdd.map((item) => ({
        ...item,
        orderId: id,
        quantity: item.quantity.toFixed(2),
      }));
      await this.orderItemsRepo.save(newItems);
    }

    if (itemsToDelete.length) {
      await Promise.all(
        itemsToDelete.map((item) =>
          this.orderItemsRepo.update(item.id, { modifiedBy: user.id }),
        ),
      );

      await Promise.all(
        itemsToDelete.map((item) => this.orderItemsRepo.softDelete(item.id)),
      );
    }

    return { order: existingOrder };
  }
}
