import { ObjectType, Field, InputType, ID } from '@nestjs/graphql';
import { BaseType } from 'src/common/baseType.types';

@ObjectType()
export class CompanyType extends BaseType {
  @Field()
  name: string;

  @Field()
  location: string;
}

@InputType()
export class CreateCompanyType {
  @Field(() => ID, { nullable: true })
  id?: string;

  @Field()
  name: string;

  @Field()
  location: string;
}

@InputType()
export class UpdateCompanyType {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  location?: string;
}
