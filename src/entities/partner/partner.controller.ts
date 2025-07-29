import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { BaseController } from 'src/common/base.resolver';
import { PartnerService } from './partner.service';
import { Partner } from './partner.entity';
import {
  CreatePartnerDto,
  UpdatePartnerDto,
  CreatePartnerSchema,
  UpdatePartnerSchema,
} from './partner.schema';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { CurrentUser, AuthUser } from 'src/decorators/currentUser.decorator';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';

@ApiBearerAuth('Authorization')
@Controller('partner')
export class PartnerController extends BaseController<
  Partner,
  CreatePartnerDto,
  UpdatePartnerDto
> {
  constructor(protected readonly partnerService: PartnerService) {
    super(partnerService);
  }

  @Get('loyal-customer')
  getMostLoyalCustomer() {
    return this.partnerService.getMostLoyalCustomer();
  }
  @Post()
  @ApiBody({
    type: CreatePartnerDto,
    examples: {
      default: {
        value: {
          name: '',
          partnerType: '',
          companyId: '',
        },
      },
    },
  })
  override create(
    @CurrentUser() user: AuthUser,
    @Body(new ZodValidationPipe(CreatePartnerSchema)) dto: CreatePartnerDto,
  ) {
    return super.create(user, dto);
  }

  @Put(':id')
  @ApiBody({
    type: UpdatePartnerDto,
    examples: {
      default: {
        value: {
          name: '',
          partnerType: '',
          companyId: '',
        },
      },
    },
  })
  override update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdatePartnerSchema)) dto: UpdatePartnerDto,
  ) {
    return super.update(user, id, dto);
  }
}
