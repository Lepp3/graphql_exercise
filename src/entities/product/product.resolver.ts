import {
  Resolver,
  Mutation,
  Args,
  ResolveField,
  Parent,
  Query,
} from '@nestjs/graphql';
import { BaseResolver } from 'src/common/base.resolver';
import { ProductService } from './product.service';
import {
  ProductType,
  TopSellingProductType,
  CreateProductType,
  UpdateProductType,
} from './product.types';
import { CurrentUser, AuthUser } from 'src/decorators/currentUser.decorator';
import { CompanyService } from '../company/company.service';
import { CompanyType } from '../company/company.types';
import { OrderItemsService } from '../orderItems/orderItems.service';
import { OrderItemsType } from '../orderItems/orderItems.type';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from '../user/user.entity';

@Resolver(() => ProductType)
export class ProductResolver extends BaseResolver<ProductType> {
  constructor(
    protected readonly productService: ProductService,
    private readonly companyService: CompanyService,
    private readonly orderItemsService: OrderItemsService,
  ) {
    super(productService);
  }

  @Query(() => [ProductType], { name: 'getAllProducts' })
  override getAll(@CurrentUser() user: AuthUser) {
    return super.getAll(user);
  }

  @Query(() => ProductType, { name: 'getProductById' })
  override getById(@CurrentUser() user: AuthUser, @Args('id') id: string) {
    return super.getById(user, id);
  }

  @Mutation(() => ProductType, { name: 'createProduct' })
  async createProduct(
    @CurrentUser() user: AuthUser,
    @Args('input') input: CreateProductType,
  ): Promise<ProductType> {
    return await this.productService.create(user, input);
  }

  @Mutation(() => ProductType, { name: 'updateProduct' })
  async updateProduct(
    @CurrentUser() user: AuthUser,
    @Args('id') id: string,
    @Args('input') input: UpdateProductType,
  ): Promise<ProductType> {
    return await this.productService.update(user, id, input);
  }

  @Mutation(() => Boolean, { name: 'deleteProduct' })
  @Roles(UserRole.OWNER)
  override delete(@CurrentUser() user: AuthUser, @Args('id') id: string) {
    return super.delete(user, id);
  }

  @Mutation(() => Boolean, { name: 'softDeleteProduct' })
  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  override softDelete(@CurrentUser() user: AuthUser, @Args('id') id: string) {
    return super.softDelete(user, id);
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
