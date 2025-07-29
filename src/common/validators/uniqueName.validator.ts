import { Repository, FindOptionsWhere, ObjectLiteral } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

export async function validateUniqueField<
  T extends ObjectLiteral,
  K extends keyof T,
>(repo: Repository<T>, where: Pick<T, K>, label?: string): Promise<void> {
  const existing = await repo.findOne({
    where: where as FindOptionsWhere<T>,
  });

  if (existing) {
    const fieldNames = Object.keys(where).join(', ');
    throw new BadRequestException(`${label ?? fieldNames} already exists`);
  }
}
