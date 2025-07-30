import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Warehouse } from './warehouse.entity';
import { WarehouseService } from './warehouse.service';
import { WarehouseController } from './warehouse.resolver';
import { Order } from '../order/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Warehouse, Order])],
  providers: [WarehouseService],
  controllers: [WarehouseController],
})
export class WarehouseModule {}
