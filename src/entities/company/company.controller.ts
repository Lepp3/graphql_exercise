import {
  Controller,
  Put,
  Body,
  Param,
  Get,
  ForbiddenException,
  HttpCode,
} from '@nestjs/common';
import { Company } from './company.entity';
import { CompanyService } from './company.service';
import { UpdateCompanyDto } from './company.schema';
import { BaseController } from 'src/common/base.controller';
import { ApiBearerAuth, ApiBody, ApiExcludeEndpoint } from '@nestjs/swagger';
import { CurrentUser, AuthUser } from 'src/decorators/currentUser.decorator';

@ApiBearerAuth('Authorization')
@Controller('company')
export class CompanyController extends BaseController<Company> {
  constructor(protected readonly companyService: CompanyService) {
    super(companyService);
  }

  @Get()
  @ApiExcludeEndpoint()
  @HttpCode(403)
  override getAll(): Promise<Company[]> {
    throw new ForbiddenException('Access to company list is restricted');
  }

  @Put(':id')
  @ApiBody({
    type: UpdateCompanyDto,
    examples: {
      default: {
        value: {
          name: '',
          location: '',
        },
      },
    },
  })
  update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateCompanyDto,
  ) {
    return this.companyService.update(user, id, dto);
  }
}
