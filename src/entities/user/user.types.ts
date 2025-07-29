import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { BaseType } from 'src/common/baseType.types';
import { UserRole } from './user.entity';

registerEnumType(UserRole, {
  name: 'User Role',
  description: 'The role of the user',
});

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
