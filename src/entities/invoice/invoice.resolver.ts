import { Controller, Post, Put, Param, Body } from '@nestjs/common';
import { BaseController } from 'src/common/base.controller';
import { CreateInvoiceInput, InvoiceService } from './invoice.service';
import { Invoice } from './invoice.entity';
import { CreateInvoiceDto, UpdateInvoiceDto } from './invoice.schema';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { CurrentUser, AuthUser } from 'src/decorators/currentUser.decorator';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { CreateInvoiceSchema, UpdateInvoiceSchema } from './invoice.schema';
@ApiBearerAuth('Authorization')
@Controller('invoice')
export class InvoiceController extends BaseController<Invoice> {
  constructor(protected readonly invoiceService: InvoiceService) {
    super(invoiceService);
  }

  @Post()
  @ApiBody({
    type: CreateInvoiceDto,
    examples: {
      default: {
        value: {
          orderId: '',
          date: '',
          invoiceNumber: '',
        },
      },
    },
  })
  create(
    @CurrentUser() user: AuthUser,
    @Body(new ZodValidationPipe(CreateInvoiceSchema)) dto: CreateInvoiceInput,
  ) {
    return this.invoiceService.create(user, dto);
  }

  @Put(':id')
  @ApiBody({
    type: UpdateInvoiceDto,
    examples: {
      default: {
        value: {
          orderId: '',
          date: '',
          invoiceNumber: '',
        },
      },
    },
  })
  update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateInvoiceSchema)) dto: UpdateInvoiceDto,
  ) {
    return this.invoiceService.update(user, id, dto);
  }
}
