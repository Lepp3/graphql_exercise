import {
  Resolver,
  Mutation,
  Args,
  ResolveField,
  Parent,
  Query,
} from '@nestjs/graphql';
import { BaseResolver } from 'src/common/base.resolver';
import {
  CreateProductInput,
  ProductService,
  UpdateProductInput,
} from './product.service';
import { ProductType, TopSellingProductType } from './product.types';
import { CurrentUser, AuthUser } from 'src/decorators/currentUser.decorator';
import { CompanyService } from '../company/company.service';
import { CompanyType } from '../company/company.types';
import { OrderItemsService } from '../orderItems/orderItems.service';
import { OrderItemsType } from '../orderItems/orderItems.type';

@Resolver(() => ProductType)
export class ProductResolver extends BaseResolver<ProductType> {
  constructor(
    protected readonly productService: ProductService,
    private readonly companyService: CompanyService,
    private readonly orderItemsService: OrderItemsService,
  ) {
    super(productService);
  }

  @Mutation(() => ProductType)
  async createProduct(
    @CurrentUser() user: AuthUser,
    @Args('input') input: CreateProductInput,
  ): Promise<ProductType> {
    return await this.productService.create(user, input);
  }

  @Mutation(() => ProductType)
  async updateProduct(
    @CurrentUser() user: AuthUser,
    @Args('id') id: string,
    @Args('input') input: UpdateProductInput,
  ): Promise<ProductType> {
    return await this.productService.update(user, id, input);
  }

  @Query(() => [TopSellingProductType])
  async bestSellers(
    @CurrentUser() user: AuthUser,
  ): Promise<TopSellingProductType[] | string> {
    return this.productService.getTopSellingProducts(user.companyId);
  }

  @ResolveField(() => CompanyType)
  async company(@Parent() product: ProductType): Promise<CompanyType> {
    return this.companyService.getById(product.companyId);
  }

  @ResolveField(() => [OrderItemsType])
  async orderItems(@Parent() product: ProductType): Promise<OrderItemsType[]> {
    return this.orderItemsService.getByProductId(product.id);
  }
}
