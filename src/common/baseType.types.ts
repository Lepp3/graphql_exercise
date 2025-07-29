import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export abstract class BaseType {
  @Field(() => ID)
  id: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  deletedAt: Date;

  @Field(() => String, { nullable: true })
  modifiedBy?: string;
}
