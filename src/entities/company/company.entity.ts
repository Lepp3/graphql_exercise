import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'src/common/base.entity';

@Entity()
export class Company extends BaseEntity {
  @Column()
  name: string;

  @Column()
  location: string;
}
