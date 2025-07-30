import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'src/common/base.entity';

export enum OrderType {
  SHIPMENT = 'shipment',
  DELIVERY = 'delivery',
}

@Entity()
export class Order extends BaseEntity {
  @Column({ type: 'enum', enum: OrderType })
  type: OrderType;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  date: Date;

  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'warehouse_id', type: 'uuid' })
  warehouseId: string;

  @Column({ name: 'partner_id', type: 'uuid' })
  partnerId: string;
}
