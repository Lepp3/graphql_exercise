import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { Product } from './product.entity';
import { BaseService } from 'src/common/base.service';
import { z } from 'zod';
import { CreateProductSchema, UpdateProductSchema } from './product.schema';
import { OrderItems } from '../orderItems/orderItems.entity';
import { validateUniqueField } from 'src/common/validators/uniqueName.validator';
import { AuthUser } from 'src/decorators/currentUser.decorator';

export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
export interface TopSellingProduct {
  productName: string;
  totalSold: number;
}

@Injectable()
export class ProductService extends BaseService<Product> {
  constructor(
    @InjectRepository(Product) repo: Repository<Product>,
    @InjectRepository(OrderItems)
    private readonly orderItemsRepo: Repository<OrderItems>,
  ) {
    super(repo);
  }

  async getByCompanyId(companyId: string): Promise<Product[]> {
    return this.repo.find({
      where: { companyId },
    } as FindManyOptions<Product>);
  }

  async getTopSellingProducts(
    companyId: string,
  ): Promise<TopSellingProduct[] | string> {
    console.log('BEST SELLERS');
    const result = await this.orderItemsRepo
      .createQueryBuilder('oi')
      .select('p.name', 'productName')
      .addSelect('SUM(oi.quantity)', 'totalSold')
      .innerJoin('order', 'o', 'o.id = oi.order_id')
      .innerJoin('product', 'p', 'p.id = oi.product_id')
      .where('o.type = :type', { type: 'shipment' })
      .andWhere('o.companyId = :companyId', { companyId })
      .andWhere('oi.deletedAt IS NULL')
      .andWhere('o.deletedAt IS NULL')
      .andWhere('p.deletedAt IS NULL')
      .groupBy('p.name')
      .orderBy('SUM(oi.quantity)', 'DESC')
      .getRawMany<TopSellingProduct>();

    return result.length > 0 ? result : 'No bestsellers yet';
  }

  async create(user: AuthUser, dto: CreateProductInput) {
    await validateUniqueField(this.repo, { code: dto.code }, 'Product Code');
    const newProduct = this.repo.create({
      ...dto,
      modifiedBy: user.id,
    });
    return this.repo.save(newProduct);
  }

  async update(user: AuthUser, id: string, dto: UpdateProductInput) {
    const product = await this.getById(id);
    if (dto.code) {
      await validateUniqueField(this.repo, { code: dto.code }, 'Product code');
    }
    Object.assign(product, dto);
    product.modifiedBy = user.id;

    return this.repo.save(product);
  }
}
