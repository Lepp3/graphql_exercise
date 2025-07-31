import { NotFoundException } from '@nestjs/common';
import { Repository, FindOptionsWhere } from 'typeorm';
import { BaseEntity } from 'src/common/base.entity';

export abstract class BaseService<T extends BaseEntity> {
  constructor(protected readonly repo: Repository<T>) {}
  async getAll(companyId?: string): Promise<T[]> {
    const items = await this.repo.find({
      where: {
        ...(companyId ? { companyId } : {}),
      } as FindOptionsWhere<T>,
    });

    if (!items) {
      return [];
    }

    return items;
  }

  async getById(id: string, companyId?: string): Promise<T> {
    const item = await this.repo.findOne({
      where: { id, ...(companyId ? { companyId } : {}) } as FindOptionsWhere<T>,
    });
    if (!item)
      throw new NotFoundException(`${this.repo.metadata.tableName} not found`);

    return item;
  }

  async softDelete(id: string, companyId?: string) {
    await this.getById(id, companyId);
    return this.repo.softDelete(id);
  }

  async delete(id: string, companyId?: string) {
    await this.getById(id, companyId);
    return this.repo.delete(id);
  }
}
