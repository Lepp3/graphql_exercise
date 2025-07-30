import { ObjectType, Field, InputType, ID } from '@nestjs/graphql';
import { BaseType } from 'src/common/baseType.types';
import { UserRole } from './user.entity';

@ObjectType()
export class UserType extends BaseType {
  @Field()
  name: string;

  @Field()
  username: string;

  @Field(() => UserRole)
  role: UserRole;

  @Field()
  companyId: string;
}

@InputType()
export class CreateUserType {
  @Field()
  name: string;

  @Field()
  username: string;

  @Field()
  password: string;

  @Field(() => UserRole)
  role: UserRole;

  @Field(() => ID)
  companyId: string;
}

@InputType()
export class ClientUserType {
  @Field()
  name: string;

  @Field()
  username: string;

  @Field()
  password: string;

  @Field(() => UserRole)
  role: UserRole;
}

@InputType()
export class UpdateUserType {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  username?: string;

  @Field({ nullable: true })
  password?: string;

  @Field(() => UserRole, { nullable: true })
  role?: UserRole;

  @Field(() => ID, { nullable: true })
  companyId?: string;
}
