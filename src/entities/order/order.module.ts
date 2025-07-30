import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { OrderService } from './order.service';
import { OrderItems } from '../orderItems/orderItems.entity';
import { OrderResolver } from './order.resolver';
import { WarehouseModule } from '../warehouse/warehouse.module';
import { PartnerModule } from '../partner/partner.module';
import { ProductModule } from '../product/product.module';
import { OrderItemsModule } from '../orderItems/orderItems.module';
import { InvoiceModule } from '../invoice/invoice.module';
import { UserModule } from '../user/user.module';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItems]),
    forwardRef(() => WarehouseModule),
    forwardRef(() => PartnerModule),
    forwardRef(() => ProductModule),
    forwardRef(() => CompanyModule),
    forwardRef(() => OrderItemsModule),
    forwardRef(() => InvoiceModule),
    forwardRef(() => UserModule),
  ],
  providers: [OrderService, OrderResolver],
  exports: [OrderService],
})
export class OrderModule {}
