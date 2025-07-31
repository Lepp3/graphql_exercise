import { BaseResolver } from 'src/common/base.resolver';
import { InvoiceService } from './invoice.service';
import { CurrentUser, AuthUser } from 'src/decorators/currentUser.decorator';
import {
  InvoiceType,
  UpdateInvoiceType,
  CreateInvoiceType,
} from './invoice.types';
import {
  Resolver,
  Args,
  Mutation,
  ResolveField,
  Parent,
  Query,
} from '@nestjs/graphql';
import { OrderService } from '../order/order.service';
import { UserService } from '../user/user.service';
import { OrderType } from '../order/order.types';
import { UserType } from '../user/user.types';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from '../user/user.entity';
import { ZodValidationPipe } from 'nestjs-zod';
import { CreateInvoiceSchema, UpdateInvoiceSchema } from './invoice.schema';

@Resolver(() => InvoiceType)
export class InvoiceResolver extends BaseResolver<InvoiceType> {
  constructor(
    protected readonly invoiceService: InvoiceService,
    private readonly orderService: OrderService,
    private readonly userService: UserService,
  ) {
    super(invoiceService);
  }

  @Query(() => [InvoiceType], { name: 'getAllInvoices' })
  override getAll(@CurrentUser() user: AuthUser) {
    return super.getAll(user);
  }

  @Query(() => InvoiceType, { name: 'getInvoiceById' })
  override getById(@CurrentUser() user: AuthUser, @Args('id') id: string) {
    return super.getById(user, id);
  }

  @Mutation(() => InvoiceType, { name: 'createInvoice' })
  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  async createInvoice(
    @CurrentUser() user: AuthUser,
    @Args('input', new ZodValidationPipe(CreateInvoiceSchema))
    input: CreateInvoiceType,
  ): Promise<InvoiceType> {
    return this.invoiceService.create(user, input);
  }

  @Mutation(() => InvoiceType, { name: 'updateInvoice' })
  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  async updateInvoice(
    @CurrentUser() user: AuthUser,
    @Args('id') id: string,
    @Args('input', new ZodValidationPipe(UpdateInvoiceSchema))
    input: UpdateInvoiceType,
  ): Promise<InvoiceType> {
    return this.invoiceService.update(user, id, input);
  }

  @Mutation(() => Boolean, { name: 'deleteInvoice' })
  @Roles(UserRole.OWNER)
  override delete(@CurrentUser() user: AuthUser, @Args('id') id: string) {
    return super.delete(user, id);
  }

  @Mutation(() => Boolean, { name: 'softDeleteInvoice' })
  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  override softDelete(@CurrentUser() user: AuthUser, @Args('id') id: string) {
    return super.softDelete(user, id);
  }

  @ResolveField(() => OrderType)
  async order(@Parent() invoice: InvoiceType): Promise<OrderType> {
    return this.orderService.getById(invoice.orderId);
  }

  @ResolveField(() => UserType)
  async user(@Parent() invoice: InvoiceType): Promise<UserType> {
    return this.userService.getById(invoice.userId);
  }
}
