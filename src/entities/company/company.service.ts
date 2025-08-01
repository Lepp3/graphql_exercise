import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Company } from './company.entity';
import { z } from 'zod';
import { CreateCompanySchema, UpdateCompanySchema } from './company.schema';
import { BaseService } from 'src/common/base.service';
import { validateUniqueField } from 'src/common/validators/uniqueName.validator';
import { AuthUser } from 'src/decorators/currentUser.decorator';

export type CreateCompanyInput = z.infer<typeof CreateCompanySchema>;
export type UpdateCompanyInput = z.infer<typeof UpdateCompanySchema>;

@Injectable()
export class CompanyService extends BaseService<Company> {
  constructor(@InjectRepository(Company) repo: Repository<Company>) {
    super(repo);
  }

  async getCompanyById(user: AuthUser, id: string): Promise<Company> {
    if (user.companyId !== id) {
      throw new NotFoundException('Company not found!');
    }
    const company = await this.repo.findOne({
      where: { id } as FindOptionsWhere<Company>,
    });
    if (!company)
      throw new NotFoundException(`${this.repo.metadata.tableName} not found`);

    return company;
  }

  async create(dto: CreateCompanyInput): Promise<Company> {
    await validateUniqueField(this.repo, { name: dto.name }, 'Company name');
    const company = this.repo.create(dto);
    return this.repo.save(company);
  }

  async update(
    user: AuthUser,
    id: string,
    dto: UpdateCompanyInput,
  ): Promise<Company> {
    const company = await this.getById(id);
    if (company && company.id !== user.companyId) {
      throw new ConflictException(
        'Cannot modify records from other companies!',
      );
    }
    if (dto.name && dto.name !== company.name) {
      await validateUniqueField(this.repo, { name: dto.name }, 'Company name');
    }

    Object.assign(company, dto);
    company.modifiedBy = user.id;

    return this.repo.save(company);
  }

  async softDelete(id: string) {
    return super.softDelete(id);
  }

  async delete(id: string) {
    return super.delete(id);
  }
}
