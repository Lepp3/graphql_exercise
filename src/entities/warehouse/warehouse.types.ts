import { ObjectType, Field } from '@nestjs/graphql';
import { BaseType } from 'src/common/baseType.types';
import { SupportType } from './warehouse.entity';

@ObjectType()
export class WarehouseType extends BaseType {
  @Field()
  name: string;

  @Field(() => SupportType)
  supportType: SupportType;

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
