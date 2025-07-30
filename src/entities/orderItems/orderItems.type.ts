import { ObjectType, Field, InputType, ID, Float } from '@nestjs/graphql';
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

@InputType()
export class CreateOrderItemsType {
  @Field(() => ID, { nullable: true })
  id?: string;

  @Field(() => ID)
  productId: string;

  @Field(() => Float)
  quantity: number;
}

@InputType()
export class CreateOrderItemsWithOrderIdType extends CreateOrderItemsType {
  @Field(() => ID)
  orderId: string;
}

@InputType()
export class UpdateOrderItemsType {
  @Field(() => ID)
  id: string;

  @Field(() => ID, { nullable: true })
  productId?: string;

  @Field(() => Float, { nullable: true })
  quantity?: number;
}
