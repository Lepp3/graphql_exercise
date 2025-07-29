import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/base.entity';
import { Company } from '../company/company.entity';
import { Order } from '../order/order.entity';

export enum SupportType {
  LIQUID = 'liquid',
  SOLID = 'solid',
}

@Entity()
export class Warehouse extends BaseEntity {
  @Column()
  name: string;

  @Column({ name: 'support_type', type: 'enum', enum: SupportType })
  supportType: SupportType;

  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @ManyToOne(() => Company, (company) => company.warehouses)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @OneToMany(() => Order, (order) => order.warehouse)
  orders: Order[];
}
