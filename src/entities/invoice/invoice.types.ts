import { ObjectType, Field, InputType, ID } from '@nestjs/graphql';
import { BaseType } from 'src/common/baseType.types';

@ObjectType()
export class InvoiceType extends BaseType {
  @Field(() => Date)
  date: Date;

  @Field()
  invoiceNumber: string;

  @Field()
  userId: string;

  @Field()
  orderId: string;
}

@InputType()
export class CreateInvoiceType {
  @Field(() => ID, { nullable: true })
  id?: string;

  @Field(() => Date)
  date: Date;

  @Field(() => ID)
  orderId: string;

  @Field()
  invoiceNumber: string;

  @Field(() => ID)
  userId: string;
}

@InputType()
export class UpdateInvoiceType {
  @Field(() => ID)
  id: string;

  @Field(() => Date, { nullable: true })
  date?: Date;

  @Field({ nullable: true })
  invoiceNumber?: string;

  @Field({ nullable: true })
  userId?: string;

  @Field({ nullable: true })
  orderId?: string;
}
