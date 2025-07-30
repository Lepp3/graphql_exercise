import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItems } from './orderItems.entity';
import { OrderItemsService } from './orderItems.service';
import { OrderModule } from '../order/order.module';
import { OrderItemsResolver } from './orderItems.resolver';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderItems]),
    forwardRef(() => OrderModule),
    forwardRef(() => ProductModule),
  ],
  providers: [OrderItemsService, OrderItemsResolver],
  exports: [OrderItemsService],
})
export class OrderItemsModule {}
