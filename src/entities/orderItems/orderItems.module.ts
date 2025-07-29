import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItems } from './orderItems.entity';
import { OrderItemsService } from './orderItems.service';
import { OrderItemsController } from './orderItems.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OrderItems])],
  providers: [OrderItemsService],
  controllers: [OrderItemsController],
})
export class OrderItemsModule {}
