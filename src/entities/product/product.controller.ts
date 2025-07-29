import { Controller, Post, Put, Body, Param, Get } from '@nestjs/common';
import { BaseController } from 'src/common/base.controller';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import {
  CreateProductDto,
  CreateProductSchema,
  UpdateProductDto,
  UpdateProductSchema,
} from './product.schema';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { CurrentUser, AuthUser } from 'src/decorators/currentUser.decorator';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';

@ApiBearerAuth('Authorization')
@Controller('product')
export class ProductController extends BaseController<
  Product,
  CreateProductDto,
  UpdateProductDto
> {
  constructor(protected readonly productService: ProductService) {
    super(productService);
  }
  @Get('best-seller')
  getBestSellers(@CurrentUser() user: AuthUser) {
    return this.productService.getTopSellingProducts(user.companyId);
  }

  @Post()
  @ApiBody({
    type: CreateProductDto,
    examples: {
      default: {
        value: {
          type: '',
          code: '',
          price: '',
        },
      },
    },
  })
  override create(
    @CurrentUser() user: AuthUser,
    @Body(new ZodValidationPipe(CreateProductSchema)) dto: CreateProductDto,
  ) {
    return super.create(user, dto);
  }

  @Put(':id')
  @ApiBody({
    type: UpdateProductDto,
    examples: {
      default: {
        value: {
          type: '',
          code: '',
          price: '',
          companyId: '',
        },
      },
    },
  })
  override update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateProductSchema)) dto: UpdateProductDto,
  ) {
    return super.update(user, id, dto);
  }
}
