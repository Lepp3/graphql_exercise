import {
  Resolver,
  ResolveField,
  Args,
  Parent,
  Query,
  Mutation,
} from '@nestjs/graphql';
import { BaseResolver } from 'src/common/base.resolver';
import {
  CreatePartnerInput,
  PartnerService,
  UpdatePartnerInput,
} from './partner.service';
import { CompanyService } from '../company/company.service';
import { OrderService } from '../order/order.service';
import { CurrentUser, AuthUser } from 'src/decorators/currentUser.decorator';
import { OrderType } from '../order/order.types';
import { CompanyType } from '../company/company.types';
import { MostLoyalCustomerType, PartnerType } from './partner.types';

@Resolver(() => PartnerType)
export class PartnerResolver extends BaseResolver<PartnerType> {
  constructor(
    protected readonly partnerService: PartnerService,
    private readonly companyService: CompanyService,
    private readonly orderService: OrderService,
  ) {
    super(partnerService);
  }

  @Mutation(() => PartnerType)
  async createPartner(
    @CurrentUser() user: AuthUser,
    @Args('input') input: CreatePartnerInput,
  ): Promise<PartnerType> {
    return await this.partnerService.create(user, input);
  }

  @Mutation(() => PartnerType)
  async updatePartner(
    @CurrentUser() user: AuthUser,
    @Args('id') id: string,
    @Args('input') input: UpdatePartnerInput,
  ): Promise<PartnerType> {
    return await this.partnerService.update(user, id, input);
  }

  @Query(() => MostLoyalCustomerType, { nullable: true })
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
