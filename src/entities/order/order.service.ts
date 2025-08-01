import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { Order, OrderType } from './order.entity';
import { BaseService } from 'src/common/base.service';
import { z } from 'zod';
import {
  CreateOrderSchema,
  UpdateOrderSchema,
  CreateTransferSchema,
} from './order.schema';
import { AuthUser } from 'src/decorators/currentUser.decorator';
import { OrderItems } from '../orderItems/orderItems.entity';
import { WarehouseService } from '../warehouse/warehouse.service';
import { PartnerService } from '../partner/partner.service';
import { PartnerType } from '../partner/partner.entity';
import { ProductService } from '../product/product.service';
import { InvoiceService } from '../invoice/invoice.service';

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
export type UpdateOrderInput = z.infer<typeof UpdateOrderSchema>;
export type TransferListInput = z.infer<typeof CreateTransferSchema>;

@Injectable()
export class OrderService extends BaseService<Order> {
  private readonly orderItemsRepo: Repository<OrderItems>;
  constructor(
    @InjectRepository(Order) repo: Repository<Order>,
    @InjectRepository(OrderItems) orderItemsRepo: Repository<OrderItems>,
    private readonly warehouseService: WarehouseService,
    private readonly partnerService: PartnerService,
    private readonly productService: ProductService,
    @Inject(forwardRef(() => InvoiceService))
    private readonly invoiceService: InvoiceService,
  ) {
    super(repo);
    this.orderItemsRepo = orderItemsRepo;
  }

  async getByCompanyId(companyId: string): Promise<Order[]> {
    return this.repo.find({
      where: { companyId },
    } as FindManyOptions<Order>);
  }

  async findByPartnerId(partnerId: string): Promise<Order[]> {
    return this.repo.find({
      where: { partnerId },
    });
  }

  async findByWarehouseId(warehouseId: string) {
    return this.repo.find({ where: { warehouseId } });
  }

  async findByUserId(userId: string): Promise<Order[]> {
    return this.repo.find({ where: { userId } });
  }

  private async generateInvoiceNumber(): Promise<string> {
    const year = new Date().getFullYear();
    let increment = 1;
    let invoiceNumber: string;
    let exists: boolean;

    do {
      invoiceNumber = `INV-${year}-${increment.toString().padStart(4, '0')}`;
      exists = !!(await this.invoiceService.findByInvoiceNumber(invoiceNumber));
      increment++;
      if (increment > 100000) {
        throw new Error('Unable to generate unique invoice number');
      }
    } while (exists);

    return invoiceNumber;
  }

  async createOrderWithItems(user: AuthUser, dto: CreateOrderInput) {
    const { items, ...orderData } = dto;

    if (dto.partnerId) {
      await this.validatePartnerForOrder(
        dto.partnerId,
        dto.type,
        user.companyId,
      );
    }

    await this.validateItemsForWarehouse(
      dto.warehouseId,
      items,
      user.companyId,
    );

    if (dto.type === OrderType.SHIPMENT) {
      for (const { productId, quantity } of items) {
        const available = await this.getStockLevel(dto.warehouseId, productId);
        if (available < quantity) {
          throw new ConflictException(
            `Insufficient stock for product ${productId}: available ${available}, requested ${quantity}`,
          );
        }
      }
    }

    const order = this.repo.create(orderData);
    order.companyId = user.companyId;
    order.userId = user.id;

    await this.repo.save(order);

    const orderItems = items.map((item) => ({
      ...item,
      orderId: order.id,
      quantity: item.quantity.toFixed(2),
    }));

    await this.orderItemsRepo.save(orderItems);

    if (dto.partnerId && (dto.type = OrderType.SHIPMENT)) {
      const invoiceNumber = await this.generateInvoiceNumber();
      await this.invoiceService.create(user, {
        date: order.date,
        orderId: order.id,
        invoiceNumber,
        userId: user.id,
      });
    }

    return order;
  }

  async updateOrderWithItems(
    user: AuthUser,
    dto: UpdateOrderInput,
    id: string,
  ) {
    const { items, type, warehouseId, partnerId, date } = dto;
    const existingOrder = await this.getById(id, user.companyId);

    const newType = type ?? existingOrder.type;
    const newWarehouseId = warehouseId ?? existingOrder.warehouseId;
    const newPartnerId = partnerId ?? existingOrder.partnerId;

    await this.validatePartnerForOrder(newPartnerId, newType, user.companyId);
    if (items && Array.isArray(items)) {
      await this.validateItemsForWarehouse(
        newWarehouseId,
        items,
        user.companyId,
      );
    }

    existingOrder.type = newType;
    existingOrder.partnerId = newPartnerId;
    existingOrder.date = date ?? existingOrder.date;
    existingOrder.warehouseId = newWarehouseId;
    existingOrder.modifiedBy = user.id;
    await this.repo.save(existingOrder);

    if (!items || !Array.isArray(items)) return existingOrder;
    const existingItems = await this.orderItemsRepo.find({
      where: { orderId: id },
    });
    const toUpdate = items.filter((i) => i.id);
    const toAdd = items.filter((i) => !i.id);
    const toDelete = existingItems.filter(
      (e) => !items.some((i) => i.id === e.id),
    );

    for (const item of toUpdate) {
      await this.orderItemsRepo.update(item.id!, {
        productId: item.productId,
        quantity: item.quantity.toFixed(2),
        modifiedBy: user.id,
      });
    }
    if (toAdd.length) {
      const newItems = toAdd.map((i) => ({
        ...i,
        orderId: id,
        quantity: i.quantity.toFixed(2),
      }));
      await this.orderItemsRepo.save(newItems);
    }
    if (toDelete.length) {
      await Promise.all(
        toDelete.map((i) =>
          this.orderItemsRepo.update(i.id, { modifiedBy: user.id }),
        ),
      );
      await Promise.all(
        toDelete.map((i) => this.orderItemsRepo.softDelete(i.id)),
      );
    }

    return existingOrder;
  }

  async transferItems(user: AuthUser, dto: TransferListInput) {
    const warehouseFrom = await this.warehouseService.getById(
      dto.warehouseFrom,
      user.companyId,
    );

    const warehouseTo = await this.warehouseService.getById(
      dto.warehouseTo,
      user.companyId,
    );

    if (warehouseFrom.supportType !== warehouseTo.supportType) {
      throw new ConflictException(
        `${warehouseFrom.name} has different support type than ${warehouseTo.name}`,
      );
    }

    await this.validateItemsForWarehouse(
      dto.warehouseFrom,
      dto.items,
      user.companyId,
    );

    await this.validateItemsForWarehouse(
      dto.warehouseTo,
      dto.items,
      user.companyId,
    );

    const shipmentDto: CreateOrderInput = {
      warehouseId: dto.warehouseFrom,
      partnerId: null,
      type: OrderType.SHIPMENT,
      date: new Date(),
      items: dto.items,
    };

    const deliveryDto: CreateOrderInput = {
      warehouseId: dto.warehouseTo,
      partnerId: null,
      type: OrderType.DELIVERY,
      date: new Date(),
      items: dto.items,
    };

    const fromOrder = await this.createOrderWithItems(user, shipmentDto);
    const toOrder = await this.createOrderWithItems(user, deliveryDto);

    return { fromOrder, toOrder };
  }

  private async validatePartnerForOrder(
    partnerId: string | null,
    type: OrderType,
    companyId: string,
  ) {
    if (!partnerId) return;
    const partner = await this.partnerService.getById(partnerId, companyId);
    if (
      (partner.partnerType === PartnerType.CUSTOMER &&
        type === OrderType.DELIVERY) ||
      (partner.partnerType === PartnerType.SUPPLIER &&
        type === OrderType.SHIPMENT)
    ) {
      throw new ConflictException('Partner type incompatible with order type!');
    }
  }

  private async validateItemsForWarehouse(
    warehouseId: string,
    items: Array<{ productId: string }>,
    companyId: string,
  ) {
    const warehouse = await this.warehouseService.getById(
      warehouseId,
      companyId,
    );
    const products = await Promise.all(
      items.map((i) => this.productService.getById(i.productId, companyId)),
    );
    products.forEach((product) => {
      if (product.type !== warehouse.supportType) {
        throw new ConflictException(
          `${product.name} of type ${product.type} does not match warehouse support type!`,
        );
      }
    });
  }

  private async getStockLevel(
    warehouseId: string,
    productId: string,
  ): Promise<number> {
    const raw = await this.repo
      .createQueryBuilder('o')
      .select(
        `SUM(
            CASE
              WHEN o.type = 'delivery' THEN oi.quantity
              WHEN o.type = 'shipment' THEN -oi.quantity
              ELSE 0
            END
          )`,
        'stockLevel',
      )
      .innerJoin('order_items', 'oi', 'oi.order_id = o.id')
      .where('o.warehouse_id = :wid', { wid: warehouseId })
      .andWhere('oi.product_id = :pid', { pid: productId })
      .andWhere('o.deletedAt IS NULL')
      .andWhere('oi.deletedAt IS NULL')
      .getRawOne<{ stockLevel: string }>();

    const stockStr = raw?.stockLevel ?? '0';

    return Number(stockStr);
  }
}
