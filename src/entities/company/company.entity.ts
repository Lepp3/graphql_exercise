import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/base.entity';
import { User } from '../user/user.entity';
import { Warehouse } from '../warehouse/warehouse.entity';
import { Partner } from '../partner/partner.entity';
import { Product } from '../product/product.entity';
import { Order } from '../order/order.entity';

@Entity()
export class Company extends BaseEntity {
  @Column()
  name: string;

  @Column()
  location: string;

  @OneToMany(() => User, (user) => user.company)
  users: User[];

  @OneToMany(() => Warehouse, (warehouse) => warehouse.company)
  warehouses: Warehouse[];

  @OneToMany(() => Partner, (partner) => partner.company)
  partners: Partner[];

  @OneToMany(() => Product, (product) => product.company)
  products: Partner[];

  @OneToMany(() => Order, (order) => order.company)
  orders: Order[];
}
