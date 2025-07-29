import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginInput, LoginSchema } from './login.schema';
import {
  RegisterWithCompanyDto,
  RegisterWithCompanyInput,
  RegisterWithCompanySchema,
} from './register.schema';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { Public } from 'src/decorators/public.decorator';
import { LoginDto } from './login.schema';
import { ApiBody } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiBody({
    type: RegisterWithCompanyDto,
    examples: {
      default: {
        value: {
          companyName: '',
          companyLocation: '',
          name: '',
          username: '',
          password: '',
        },
      },
    },
  })
  @Post('register')
  register(
    @Body(new ZodValidationPipe(RegisterWithCompanySchema))
    body: RegisterWithCompanyInput,
  ) {
    return this.authService.register(body);
  }
  @Public()
  @Post('login')
  @ApiBody({
    type: LoginDto,
    examples: {
      default: {
        value: {
          username: '',
          password: '',
        },
      },
    },
  })
  login(@Body(new ZodValidationPipe(LoginSchema)) body: LoginInput) {
    return this.authService.login(body);
  }
}
