import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { Warehouse } from './warehouse.entity';
import { BaseService } from 'src/common/base.service';
import { z } from 'zod';
import {
  CreateWarehouseSchema,
  UpdateWarehouseSchema,
} from './warehouse.schema';
import { Order } from '../order/order.entity';
import { validateUniqueField } from 'src/common/validators/uniqueName.validator';
import { AuthUser } from 'src/decorators/currentUser.decorator';
import { OrderType } from '../order/order.entity';
import { PartnerType } from '../partner/partner.entity';

export type CreateWarehouseInput = z.infer<typeof CreateWarehouseSchema>;
export type UpdateWarehouseInput = z.infer<typeof UpdateWarehouseSchema>;
export interface HighestStockPerWarehouse {
  warehouseName: string;
  nameOfProduct: string;
  maxProduct: number;
}

@Injectable()
export class WarehouseService extends BaseService<Warehouse> {
  constructor(
    @InjectRepository(Warehouse) repo: Repository<Warehouse>,
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
  ) {
    super(repo);
  }

  async getByCompanyId(companyId: string): Promise<Warehouse[]> {
    return this.repo.find({
      where: { companyId },
    } as FindManyOptions<Warehouse>);
  }

  async create(user: AuthUser, dto: CreateWarehouseInput) {
    await validateUniqueField(this.repo, { name: dto.name }, 'Invoice Number');
    const warehouse = this.repo.create(dto);
    warehouse.companyId = user.companyId;
    warehouse.modifiedBy = user.id;
    return this.repo.save(warehouse);
  }

  async update(
    user: AuthUser,
    id: string,
    dto: UpdateWarehouseInput,
  ): Promise<Warehouse> {
    const warehouse = await this.getById(id, user.companyId);
    if (dto.name) {
      await validateUniqueField(
        this.repo,
        { name: dto.name },
        'Warehouse name',
      );
    }
    if (dto.supportType && dto.supportType !== warehouse.supportType) {
      await this.checkForDeliveries(id);
    }
    Object.assign(warehouse, dto);
    warehouse.modifiedBy = user.id;
    return this.repo.save(warehouse);
  }

  async getHighestStockPerWarehouse(
    companyId: string,
  ): Promise<HighestStockPerWarehouse[]> {
    const subQuery = this.orderRepo
      .createQueryBuilder('o')
      .select('w.name', 'warehouseName')
      .addSelect('p.name', 'productName')
      .addSelect(
        `
      SUM(
        CASE
          WHEN o.type = 'delivery' THEN oi.quantity
          WHEN o.type = 'shipment' THEN -oi.quantity
          ELSE 0
        END
      )`,
        'stockLevel',
      )
      .innerJoin('order_items', 'oi', 'oi.order_id = o.id')
      .innerJoin('product', 'p', 'p.id = oi.product_id')
      .innerJoin('warehouse', 'w', 'w.id = o.warehouse_id')
      .where('o.deletedAt IS NULL')
      .andWhere('oi.deletedAt IS NULL')
      .andWhere('p.deletedAt IS NULL')
      .andWhere('w.companyId = :companyId', { companyId })
      .andWhere('p.companyId = :companyId', { companyId })
      .groupBy('w.name')
      .addGroupBy('p.name');

    const result = await this.orderRepo
      .createQueryBuilder()
      .select('s."warehouseName"', 'warehouseName')
      .distinctOn(['s."warehouseName"'])
      .addSelect('s."productName"', 'nameOfProduct')
      .addSelect('s."stockLevel"', 'maxProduct')
      .from(`(${subQuery.getQuery()})`, 's')
      .setParameters(subQuery.getParameters())
      .orderBy('s."warehouseName"', 'ASC')
      .addOrderBy('s."stockLevel"', 'DESC')
      .getRawMany<HighestStockPerWarehouse>();

    return result;
  }

  private async checkForDeliveries(warehouseId: string) {
    const count = await this.orderRepo
      .createQueryBuilder('o')
      .innerJoin('partner', 'p', 'p.id = o.partner_id')
      .where('o.warehouse_id = :wid', { wid: warehouseId })
      .andWhere('o.type = :delivery', { delivery: OrderType.DELIVERY })
      .andWhere('p.partnerType = :ptype', { ptype: PartnerType.SUPPLIER })
      .andWhere('o.deletedAt IS NULL')
      .getCount();

    if (count > 0) {
      throw new ConflictException(
        'Cannot change warehouse support type: there are existing supplier deliveries.',
      );
    }
  }
}
