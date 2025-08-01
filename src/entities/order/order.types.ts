import { ObjectType, Field, ID, InputType } from '@nestjs/graphql';
import { BaseType } from 'src/common/baseType.types';
import { OrderType as OrderTypeEnum } from './order.entity';
import { CreateOrderItemsType } from '../orderItems/orderItems.type';

@ObjectType()
export class OrderType extends BaseType {
  @Field(() => OrderTypeEnum)
  type: OrderTypeEnum;

  @Field(() => Date, { nullable: true })
  date: Date;

  @Field()
  companyId: string;

  @Field()
  userId: string;

  @Field(() => ID, { nullable: true })
  partnerId?: string | null;

  @Field()
  warehouseId: string;
}

@InputType()
export class CreateOrderType {
  @Field(() => ID, { nullable: true })
  id?: string;

  @Field(() => OrderTypeEnum)
  type: OrderTypeEnum;

  @Field(() => Date, { nullable: true })
  date?: Date;

  @Field(() => ID)
  warehouseId: string;

  @Field(() => ID, { nullable: true })
  partnerId?: string | null;

  @Field(() => [CreateOrderItemsType])
  items: CreateOrderItemsType[];
}

@InputType()
export class UpdateOrderType {
  @Field(() => ID)
  id: string;

  @Field(() => OrderTypeEnum, { nullable: true })
  type?: OrderTypeEnum;

  @Field(() => Date, { nullable: true })
  date?: Date;

  @Field(() => ID, { nullable: true })
  warehouseId?: string;

  @Field(() => ID, { nullable: true })
  partnerId?: string | null;

  @Field(() => [CreateOrderItemsType], { nullable: true })
  items?: CreateOrderItemsType[];
}

@InputType()
export class TransferListType {
  @Field(() => ID)
  warehouseFrom: string;

  @Field(() => ID)
  warehouseTo: string;

  @Field(() => [CreateOrderItemsType])
  items: CreateOrderItemsType[];
}
