import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ProductService } from './product.service';
import { OrderItems } from '../orderItems/orderItems.entity';
import { ProductResolver } from './product.resolver';
import { CompanyModule } from '../company/company.module';
import { OrderItemsModule } from '../orderItems/orderItems.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, OrderItems]),
    forwardRef(() => CompanyModule),
    forwardRef(() => OrderItemsModule),
  ],
  providers: [ProductService, ProductResolver],
  exports: [ProductService],
})
export class ProductModule {}
