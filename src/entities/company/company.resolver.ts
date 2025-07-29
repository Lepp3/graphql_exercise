import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { CompanyType } from './company.types';
import { CompanyService } from './company.service';
import { UpdateCompanyDto } from './company.schema';
import { BaseResolver } from 'src/common/base.resolver';
import { CurrentUser, AuthUser } from 'src/decorators/currentUser.decorator';

// @ApiBearerAuth('Authorization')
@Resolver(() => CompanyType)
export class CompanyController extends BaseResolver<CompanyType> {
  constructor(protected readonly companyService: CompanyService) {
    super(companyService);
  }

  @Mutation(() => CompanyType)
  async updateCompany(
    @CurrentUser() user: AuthUser,
    @Args('id') id: string,
    @Args('input') input: UpdateCompanyDto,
  ): Promise<CompanyType> {
    return await this.companyService.update(user, id, input);
  }
}
