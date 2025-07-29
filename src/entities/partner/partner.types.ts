import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { BaseType } from 'src/common/baseType.types';
import { PartnerType as PartnerTypeEnum } from './partner.entity';

registerEnumType(PartnerTypeEnum, {
  name: 'PartnerType',
  description: 'The type of business partner',
});

@ObjectType()
export class PartnerType extends BaseType {
  @Field()
  name: string;

  @Field(() => PartnerTypeEnum)
  partnerType: PartnerTypeEnum;

  @Field()
  companyId: string;
}
