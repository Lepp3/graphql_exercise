import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'src/common/base.entity';
// import { Company } from '../company/company.entity';
// import { Order } from '../order/order.entity';
// import { Invoice } from '../invoice/invoice.entity';

export enum UserRole {
  OWNER = 'owner',
  OPERATOR = 'operator',
  VIEWER = 'viewer',
}

@Entity()
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column()
  username: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.VIEWER })
  role: UserRole;

  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  // @ManyToOne(() => Company, (company) => company.users)
  // @JoinColumn({ name: 'company_id' })
  // company: Company;

  // @OneToMany(() => Order, (order) => order.user)
  // orders: Order[];

  // @OneToMany(() => Invoice, (invoice) => invoice.user)
  // invoices: Invoice[];
}
