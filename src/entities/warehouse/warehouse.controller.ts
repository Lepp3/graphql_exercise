import { Controller, Post, Put, Body, Param, Get } from '@nestjs/common';
import { BaseController } from 'src/common/base.controller';
import { WarehouseService } from './warehouse.service';
import { Warehouse } from './warehouse.entity';
import {
  CreateWarehouseDto,
  CreateWarehouseSchema,
  UpdateWarehouseDto,
  UpdateWarehouseSchema,
} from './warehouse.schema';
import { ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser, AuthUser } from 'src/decorators/currentUser.decorator';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
@ApiBearerAuth('Authorization')
@Controller('warehouse')
export class WarehouseController extends BaseController<
  Warehouse,
  CreateWarehouseDto,
  UpdateWarehouseDto
> {
  constructor(protected readonly warehouseService: WarehouseService) {
    super(warehouseService);
  }

  @Get('highest-stock')
  getHighestStock() {
    return this.warehouseService.getHighestStockPerWarehouse();
  }

  @Post()
  @ApiBody({
    type: CreateWarehouseDto,
    examples: {
      default: {
        value: {
          name: '',
          supportType: '',
          companyId: '',
        },
      },
    },
  })
  override create(
    @CurrentUser() user: AuthUser,
    @Body(new ZodValidationPipe(CreateWarehouseSchema)) dto: CreateWarehouseDto,
  ) {
    return super.create(user, dto);
  }

  @Put(':id')
  @ApiBody({
    type: UpdateWarehouseDto,
    examples: {
      default: {
        value: {
          name: '',
          supportType: '',
          companyId: '',
        },
      },
    },
  })
  override update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateWarehouseSchema)) dto: UpdateWarehouseDto,
  ) {
    return super.update(user, id, dto);
  }
}
