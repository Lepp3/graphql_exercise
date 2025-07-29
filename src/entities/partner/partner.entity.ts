import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/base.entity';
import { Company } from '../company/company.entity';
import { Order } from '../order/order.entity';

export enum PartnerType {
  SUPPLIER = 'supplier',
  CUSTOMER = 'customer',
}

@Entity()
export class Partner extends BaseEntity {
  @Column()
  name: string;

  @Column({ name: 'partner_type', type: 'enum', enum: PartnerType })
  partnerType: PartnerType;

  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @ManyToOne(() => Company, (company) => company.partners)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @OneToMany(() => Order, (order) => order.warehouse)
  orders: Order[];
}
