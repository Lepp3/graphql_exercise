import { ObjectType, Field } from '@nestjs/graphql';
import { BaseType } from 'src/common/baseType.types';

@ObjectType()
export class OrderItemsType extends BaseType {
  @Field()
  quantity: string;

  @Field()
  orderId: string;

  @Field()
  productId: string;
}
