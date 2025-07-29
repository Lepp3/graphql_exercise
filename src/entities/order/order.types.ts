import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { BaseType } from 'src/common/baseType.types';
import { OrderType as OrderTypeEnum } from './order.entity';

registerEnumType(OrderTypeEnum, {
  name: 'OrderType',
  description: 'the type of order',
});

@ObjectType()
export class OrderType extends BaseType {
  @Field(() => OrderTypeEnum)
  type: OrderTypeEnum;

  @Field(() => Date)
  date: Date;

  @Field()
  companyId: string;

  @Field()
  userId: string;

  @Field()
  partnerId: string;

  @Field()
  warehouseId: string;
}
