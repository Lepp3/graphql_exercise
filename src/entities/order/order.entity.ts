import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/base.entity';
import { Company } from '../company/company.entity';
import { User } from '../user/user.entity';
import { Warehouse } from '../warehouse/warehouse.entity';
import { Partner } from '../partner/partner.entity';
import { OrderItems } from '../orderItems/orderItems.entity';
import { Invoice } from '../invoice/invoice.entity';

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

  @ManyToOne(() => Company, (company) => company.orders)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'warehouse_id', type: 'uuid' })
  warehouseId: string;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.orders)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @Column({ name: 'partner_id', type: 'uuid' })
  partnerId: string;

  @ManyToOne(() => Partner, (partner) => partner.orders)
  @JoinColumn({ name: 'partner_id' })
  partner: Partner;

  @OneToMany(() => OrderItems, (orderItem) => orderItem.order)
  orderItems: OrderItems[];

  @OneToMany(() => Invoice, (invoice) => invoice.order)
  invoices: Invoice[];
}
