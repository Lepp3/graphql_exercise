import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { SupportType as SupportTypeEnum } from '../warehouse/warehouse.entity';
import { BaseType } from 'src/common/baseType.types';

registerEnumType(SupportTypeEnum, {
  name: 'Support Type',
  description: 'The type of products a warehouse supports',
});

ObjectType();
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
