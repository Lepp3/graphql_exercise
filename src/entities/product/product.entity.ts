import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'src/common/base.entity';
import { SupportType } from '../warehouse/warehouse.entity';

@Entity()
export class Product extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'enum', enum: SupportType })
  type: SupportType;

  @Column()
  code: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: string;

  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;
}
