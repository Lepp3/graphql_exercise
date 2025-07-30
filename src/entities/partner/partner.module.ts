import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Partner } from './partner.entity';
import { PartnerService } from './partner.service';
import { Order } from '../order/order.entity';
import { PartnerResolver } from './partner.resolver';
import { CompanyModule } from '../company/company.module';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Partner, Order]),
    forwardRef(() => CompanyModule),
    forwardRef(() => OrderModule),
  ],
  providers: [PartnerService, PartnerResolver],
  exports: [PartnerService],
})
export class PartnerModule {}
