import { ObjectType, Field } from '@nestjs/graphql';
import { BaseType } from 'src/common/baseType.types';

@ObjectType()
export class CompanyType extends BaseType {
  @Field()
  name: string;

  @Field()
  location: string;
}
