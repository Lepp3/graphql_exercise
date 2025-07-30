import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Partner } from './partner.entity';
import { PartnerService } from './partner.service';
import { PartnerController } from './partner.resolver';
import { Order } from '../order/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Partner, Order])],
  providers: [PartnerService],
  controllers: [PartnerController],
})
export class PartnerModule {}
