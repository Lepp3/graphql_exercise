import { ObjectType, Field, ID, InputType } from '@nestjs/graphql';
import { SupportType as SupportTypeEnum } from '../warehouse/warehouse.entity';
import { BaseType } from 'src/common/baseType.types';

@ObjectType()
export class ProductType extends BaseType {
  @Field()
  name: string;

  @Field(() => SupportTypeEnum)
  type: SupportTypeEnum;

  @Field()
  price: string;

  @Field()
  companyId: string;

  @Field()
  code: string;
}

@ObjectType()
export class TopSellingProductType {
  @Field()
  productName: string;
  @Field()
  totalSold: number;
}

@InputType()
export class CreateProductType {
  @Field(() => ID, { nullable: true })
  id?: string;

  @Field()
  name: string;

  @Field(() => SupportTypeEnum)
  type: SupportTypeEnum;

  @Field()
  code: string;

  @Field()
  price: string;

  @Field(() => ID)
  companyId: string;
}

@InputType()
export class UpdateProductType {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  name?: string;

  @Field(() => SupportTypeEnum, { nullable: true })
  type?: SupportTypeEnum;

  @Field({ nullable: true })
  code?: string;

  @Field({ nullable: true })
  price?: string;

  @Field(() => ID, { nullable: true })
  companyId?: string;
}
