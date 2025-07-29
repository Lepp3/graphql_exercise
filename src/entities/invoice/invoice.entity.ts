import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from 'src/common/base.entity';
import { User } from '../user/user.entity';
import { Order } from '../order/order.entity';

@Entity()
export class Invoice extends BaseEntity {
  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  date: Date;

  @Column({ name: 'invoice_number' })
  invoiceNumber: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.invoices)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'order_id', type: 'uuid' })
  orderId: string;

  @ManyToOne(() => Order, (order) => order.invoices)
  @JoinColumn({ name: 'order_id' })
  order: Order;
}
