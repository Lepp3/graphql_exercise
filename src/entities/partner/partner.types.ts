import { Field, ObjectType, InputType, ID } from '@nestjs/graphql';
import { BaseType } from 'src/common/baseType.types';
import { PartnerType as PartnerTypeEnum } from './partner.entity';

@ObjectType()
export class PartnerType extends BaseType {
  @Field()
  name: string;

  @Field(() => PartnerTypeEnum)
  partnerType: PartnerTypeEnum;

  @Field()
  companyId: string;
}

@ObjectType()
export class MostLoyalCustomerType {
  @Field()
  companyId: string;
  @Field()
  customerName: string;
  @Field()
  totalOrders: string;
}

@InputType()
export class CreatePartnerType {
  @Field(() => ID, { nullable: true })
  id?: string;

  @Field()
  name: string;

  @Field(() => PartnerTypeEnum)
  partnerType: PartnerTypeEnum;

  @Field(() => ID)
  companyId: string;
}

@InputType()
export class UpdatePartnerType {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  name?: string;

  @Field(() => PartnerTypeEnum, { nullable: true })
  partnerType?: PartnerTypeEnum;

  @Field(() => ID, { nullable: true })
  companyId?: string;
}
