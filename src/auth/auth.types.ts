import { ObjectType, Field, InputType } from '@nestjs/graphql';

@ObjectType()
export class AuthType {
  @Field()
  accessToken: string;
}

@InputType()
export class RegisterWithCompanyType {
  @Field()
  companyName: string;

  @Field()
  companyLocation: string;

  @Field()
  name: string;

  @Field()
  username: string;

  @Field()
  password: string;
}

@InputType()
export class LoginType {
  @Field()
  username: string;

  @Field()
  password: string;
}
