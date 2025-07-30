import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'src/common/base.entity';

@Entity()
export class OrderItems extends BaseEntity {
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantity: string;

  @Column({ name: 'order_id', type: 'uuid' })
  orderId: string;

  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;
}
