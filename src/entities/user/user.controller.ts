import { Controller, Post, Put, Body, Param } from '@nestjs/common';
import { BaseController } from 'src/common/base.controller';
import { UserService } from './user.service';
import { User } from './user.entity';
import {
  CreateUserDto,
  UpdateUserDto,
  ClientUserDto,
  ClientUserInput,
} from './update-user.schema';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { CurrentUser, AuthUser } from 'src/decorators/currentUser.decorator';

@ApiBearerAuth('Authorization')
@Controller('user')
export class UserController extends BaseController<
  User,
  CreateUserDto,
  UpdateUserDto
> {
  constructor(protected readonly userService: UserService) {
    super(userService);
  }
  @Post()
  @ApiBody({
    type: ClientUserDto,
    examples: {
      default: {
        value: {
          name: '',
          userName: '',
          role: '',
          password: '',
        },
      },
    },
  })
  override create(@CurrentUser() user: AuthUser, @Body() dto: ClientUserDto) {
    return this.userService.addUserToCompany(
      dto as ClientUserDto & ClientUserInput,
      user.companyId,
      user.id,
    );
  }

  @Put(':id')
  @ApiBody({
    type: UpdateUserDto,
    examples: {
      default: {
        value: {
          name: '',
          userName: '',
          role: '',
        },
      },
    },
  })
  override update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ) {
    return super.update(user, id, dto);
  }
}
