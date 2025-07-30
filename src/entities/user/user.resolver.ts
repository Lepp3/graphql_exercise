import {
  Resolver,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { BaseResolver } from 'src/common/base.resolver';
import { UpdateUserInput, UserService } from './user.service';
import { ClientUserDto, ClientUserInput } from './update-user.schema';
import { UserType } from './user.types';
import { AuthUser, CurrentUser } from 'src/decorators/currentUser.decorator';
import { CompanyService } from '../company/company.service';
import { OrderService } from '../order/order.service';
import { InvoiceService } from '../invoice/invoice.service';
import { CompanyType } from '../company/company.types';
import { OrderType } from '../order/order.types';
import { InvoiceType } from '../invoice/invoice.types';

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

  @Mutation(() => UserType)
  async createUser(
    @CurrentUser() user: AuthUser,
    @Args('input') input: ClientUserDto,
  ): Promise<UserType> {
    return this.userService.addUserToCompany(
      input as ClientUserDto & ClientUserInput,
      user.companyId,
      user.id,
    );
  }

  @Mutation(() => UserType)
  async updateUser(
    @CurrentUser() user: AuthUser,
    @Args('id') id: string,
    @Args('input') input: UpdateUserInput,
  ): Promise<UserType> {
    return await this.userService.update(user, id, input);
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
