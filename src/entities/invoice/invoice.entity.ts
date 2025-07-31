import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'src/common/base.entity';
import { dateTransformer } from 'src/common/formtterFunctions';

@Entity()
export class Invoice extends BaseEntity {
  @Column({
    type: 'date',
    default: () => 'CURRENT_DATE',
    transformer: dateTransformer,
  })
  date: Date;

  @Column({ name: 'invoice_number' })
  invoiceNumber: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'order_id', type: 'uuid' })
  orderId: string;
}
