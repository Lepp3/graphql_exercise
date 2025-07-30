import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Warehouse } from './warehouse.entity';
import { WarehouseService } from './warehouse.service';
import { Order } from '../order/order.entity';
import { WarehouseResolver } from './warehouse.resolver';
import { CompanyModule } from '../company/company.module';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Warehouse, Order]),
    forwardRef(() => CompanyModule),
    forwardRef(() => OrderModule),
  ],
  providers: [WarehouseService, WarehouseResolver],
  exports: [WarehouseService],
})
export class WarehouseModule {}
