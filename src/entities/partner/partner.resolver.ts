import {
  Resolver,
  ResolveField,
  Args,
  Parent,
  Query,
  Mutation,
} from '@nestjs/graphql';
import { BaseResolver } from 'src/common/base.resolver';
import { PartnerService } from './partner.service';
import { CompanyService } from '../company/company.service';
import { OrderService } from '../order/order.service';
import { CurrentUser, AuthUser } from 'src/decorators/currentUser.decorator';
import { OrderType } from '../order/order.types';
import { CompanyType } from '../company/company.types';
import {
  MostLoyalCustomerType,
  PartnerType,
  CreatePartnerType,
  UpdatePartnerType,
} from './partner.types';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from '../user/user.entity';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { CreatePartnerSchema, UpdatePartnerSchema } from './partner.schema';

@Resolver(() => PartnerType)
export class PartnerResolver extends BaseResolver<PartnerType> {
  constructor(
    protected readonly partnerService: PartnerService,
    private readonly companyService: CompanyService,
    private readonly orderService: OrderService,
  ) {
    super(partnerService);
  }

  @Query(() => [PartnerType], { name: 'getAllPartners' })
  override getAll(@CurrentUser() user: AuthUser) {
    return super.getAll(user);
  }

  @Query(() => PartnerType, { name: 'getPartnerById' })
  override getById(@CurrentUser() user: AuthUser, @Args('id') id: string) {
    return super.getById(user, id);
  }

  @Mutation(() => PartnerType, { name: 'createPartner' })
  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  async createPartner(
    @CurrentUser() user: AuthUser,
    @Args('input', new ZodValidationPipe(CreatePartnerSchema))
    input: CreatePartnerType,
  ): Promise<PartnerType> {
    return await this.partnerService.create(user, input);
  }

  @Mutation(() => PartnerType, { name: 'updatePartner' })
  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  async updatePartner(
    @CurrentUser() user: AuthUser,
    @Args('id') id: string,
    @Args('input', new ZodValidationPipe(UpdatePartnerSchema))
    input: UpdatePartnerType,
  ): Promise<PartnerType> {
    return await this.partnerService.update(user, id, input);
  }

  @Mutation(() => Boolean, { name: 'deletePartner' })
  @Roles(UserRole.OWNER)
  override delete(@CurrentUser() user: AuthUser, @Args('id') id: string) {
    return super.delete(user, id);
  }

  @Mutation(() => Boolean, { name: 'softDeletePartner' })
  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  override softDelete(@CurrentUser() user: AuthUser, @Args('id') id: string) {
    return super.softDelete(user, id);
  }

  @Query(() => MostLoyalCustomerType, {
    name: 'mostLoyalCustomer',
    nullable: true,
  })
  async mostLoyalPartner(): Promise<MostLoyalCustomerType | null> {
    const result = await this.partnerService.getMostLoyalCustomer();
    return result ?? null;
  }

  @ResolveField(() => CompanyType)
  company(@Parent() partner: PartnerType) {
    return this.companyService.getById(partner.companyId);
  }

  @ResolveField(() => [OrderType])
  orders(@Parent() partner: PartnerType) {
    return this.orderService.findByPartnerId(partner.id);
  }
}
