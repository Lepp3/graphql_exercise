import {
  Resolver,
  Mutation,
  Args,
  ResolveField,
  Parent,
  Query,
} from '@nestjs/graphql';
import { BaseResolver } from 'src/common/base.resolver';
import { UserService } from './user.service';
import { UserType, ClientUserType, UpdateUserType } from './user.types';
import { AuthUser, CurrentUser } from 'src/decorators/currentUser.decorator';
import { CompanyService } from '../company/company.service';
import { OrderService } from '../order/order.service';
import { InvoiceService } from '../invoice/invoice.service';
import { CompanyType } from '../company/company.types';
import { OrderType } from '../order/order.types';
import { InvoiceType } from '../invoice/invoice.types';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from './user.entity';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { ClientUserSchema, UpdateUserSchema } from './user.schema';

@Resolver(() => UserType)
export class UserResolver extends BaseResolver<UserType> {
  constructor(
    protected readonly userService: UserService,
    private readonly companyService: CompanyService,
    private readonly orderService: OrderService,
    private readonly invoiceService: InvoiceService,
  ) {
    super(userService);
  }

  @Query(() => [UserType], { name: 'getAllUsers' })
  override getAll(@CurrentUser() user: AuthUser) {
    console.log('USER IN RESOLVER', user);
    return super.getAll(user);
  }

  @Query(() => UserType, { name: 'getUserById' })
  override getById(@CurrentUser() user: AuthUser, @Args('id') id: string) {
    return super.getById(user, id);
  }

  @Mutation(() => UserType, { name: 'addUserToCompany' })
  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  async createUser(
    @CurrentUser() user: AuthUser,
    @Args('input', new ZodValidationPipe(ClientUserSchema))
    input: ClientUserType,
  ): Promise<UserType> {
    return this.userService.addUserToCompany(input, user.companyId, user.id);
  }

  @Mutation(() => UserType, { name: 'updateUser' })
  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  async updateUser(
    @CurrentUser() user: AuthUser,
    @Args('id') id: string,
    @Args('input', new ZodValidationPipe(UpdateUserSchema))
    input: UpdateUserType,
  ): Promise<UserType> {
    return await this.userService.update(user, id, input);
  }

  @Mutation(() => Boolean, { name: 'deleteUser' })
  @Roles(UserRole.OWNER)
  override delete(@CurrentUser() user: AuthUser, @Args('id') id: string) {
    return super.delete(user, id);
  }

  @Mutation(() => Boolean, { name: 'softDeleteUser' })
  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  override softDelete(@CurrentUser() user: AuthUser, @Args('id') id: string) {
    return super.softDelete(user, id);
  }

  @ResolveField(() => CompanyType)
  async company(@Parent() user: UserType): Promise<CompanyType> {
    return this.companyService.getById(user.companyId);
  }

  @ResolveField(() => [OrderType])
  async orders(@Parent() user: UserType): Promise<OrderType[]> {
    return await this.orderService.findByUserId(user.id);
  }

  @ResolveField(() => [InvoiceType])
  async invoices(@Parent() user: UserType): Promise<InvoiceType[]> {
    return await this.invoiceService.findByUserId(user.id);
  }
}
