import { BaseResolver } from 'src/common/base.resolver';
import { CreateInvoiceInput, InvoiceService } from './invoice.service';
import { CurrentUser, AuthUser } from 'src/decorators/currentUser.decorator';
import { InvoiceType, UpdateInvoiceType } from './invoice.types';
import {
  Resolver,
  Args,
  Mutation,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { OrderService } from '../order/order.service';
import { UserService } from '../user/user.service';
import { OrderType } from '../order/order.types';
import { UserType } from '../user/user.types';

@Resolver(() => InvoiceType)
export class InvoiceController extends BaseResolver<InvoiceType> {
  constructor(
    protected readonly invoiceService: InvoiceService,
    private readonly orderService: OrderService,
    private readonly userService: UserService,
  ) {
    super(invoiceService);
  }

  @Mutation(() => InvoiceType)
  async createInvoice(
    @CurrentUser() user: AuthUser,
    @Args('input') input: CreateInvoiceInput,
  ): Promise<InvoiceType> {
    return this.invoiceService.create(user, input);
  }

  @Mutation(() => InvoiceType)
  async updateInvoice(
    @CurrentUser() user: AuthUser,
    @Args('id') id: string,
    @Args('input') input: UpdateInvoiceType,
  ): Promise<InvoiceType> {
    return this.invoiceService.update(user, id, input);
  }

  @ResolveField(() => OrderType)
  async order(@Parent() invoice: InvoiceType) {
    return this.orderService.getById(invoice.orderId);
  }

  @ResolveField(() => UserType)
  async user(@Parent() invoice: InvoiceType) {
    return this.userService.getById(invoice.userId);
  }
}
