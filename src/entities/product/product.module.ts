import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { OrderItems } from '../orderItems/orderItems.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, OrderItems])],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
