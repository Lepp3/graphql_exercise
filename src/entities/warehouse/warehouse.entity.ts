import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'src/common/base.entity';

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
}
