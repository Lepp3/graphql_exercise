import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegisterWithCompanyInput } from './register.schema';
import { LoginInput } from './login.schema';
import { Public } from 'src/decorators/public.decorator';
import { AuthType } from './auth.types';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation(() => AuthType)
  async register(
    @Args('input') input: RegisterWithCompanyInput,
  ): Promise<AuthType> {
    return await this.authService.register(input);
  }

  @Public()
  @Mutation(() => AuthType)
  async login(@Args('input') input: LoginInput): Promise<AuthType> {
    return await this.authService.login(input);
  }
}
