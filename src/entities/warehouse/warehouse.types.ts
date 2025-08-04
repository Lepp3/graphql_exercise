import { ObjectType, Field, InputType, ID } from '@nestjs/graphql';
import { BaseType } from 'src/common/baseType.types';
import { SupportType as SupportTypeEnum } from './warehouse.entity';

@ObjectType()
export class WarehouseType extends BaseType {
  @Field()
  name: string;

  @Field(() => SupportTypeEnum)
  supportType: SupportTypeEnum;

  @Field()
  companyId: string;
}

@ObjectType()
export class HighestStockPerWarehouseType {
  @Field()
  warehouseName: string;
  @Field()
  nameOfProduct: string;
  @Field()
  maxProduct: number;
}

@InputType()
export class CreateWarehouseType {
  @Field(() => ID, { nullable: true })
  id?: string;

  @Field()
  name: string;

  @Field(() => SupportTypeEnum)
  supportType: SupportTypeEnum;
}

@InputType()
export class UpdateWarehouseType {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  name?: string;

  @Field(() => SupportTypeEnum, { nullable: true })
  supportType?: SupportTypeEnum;
}

@ObjectType()
export class StockLevelType {
  @Field()
  productId: string;

  @Field()
  productName: string;

  @Field(() => Number)
  stockLevel: number;
}
