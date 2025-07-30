import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Public } from 'src/decorators/public.decorator';
import { AuthType, RegisterWithCompanyType, LoginType } from './auth.types';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation(() => AuthType, { name: 'register' })
  async register(
    @Args('input') input: RegisterWithCompanyType,
  ): Promise<AuthType> {
    return await this.authService.register(input);
  }

  @Public()
  @Mutation(() => AuthType, { name: 'login' })
  async login(@Args('input') input: LoginType): Promise<AuthType> {
    return await this.authService.login(input);
  }
}
