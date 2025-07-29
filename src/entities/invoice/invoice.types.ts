import { ObjectType, Field } from '@nestjs/graphql';
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

ObjectType();
export class UpdateInvoiceType extends BaseType {
  @Field(() => Date, { nullable: true })
  date?: Date;

  @Field({ nullable: true })
  invoiceNumber?: string;

  @Field({ nullable: true })
  userId?: string;

  @Field({ nullable: true })
  orderId?: string;
}
