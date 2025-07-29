import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { User } from './user.entity';
import { BaseService } from 'src/common/base.service';
import { z } from 'zod';
import {
  CreateUserSchema,
  UpdateUserSchema,
  ClientUserInput,
  ClientUserDto,
} from './update-user.schema';
import * as bcrypt from 'bcrypt';
// import { validateUniqueField } from 'src/common/validators/uniqueName.validator';

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;

@Injectable()
export class UserService extends BaseService<User> {
  constructor(@InjectRepository(User) repo: Repository<User>) {
    super(repo);
  }

  // protected override async beforeCreate(
  //   data: DeepPartial<User>,
  //   companyId: string,
  // ) {
  //   await validateUniqueField(
  //     this.repo,
  //     { username: data.username!, companyId },
  //     'Username',
  //   );
  // }

  async getByCompanyId(companyId: string): Promise<User[]> {
    return this.repo.find({
      where: { companyId },
    } as FindManyOptions<User>);
  }

  async getByUsername(username: string, withPassword = false) {
    return this.repo.findOne({
      where: { username },
      select: {
        id: true,
        username: true,
        password: withPassword,
        role: true,
        companyId: true,
      },
    });
  }

  async createNewOwner(dto: CreateUserInput) {
    const newUser = await this.repo.save(dto);
    return newUser;
  }

  async addUserToCompany(
    dto: ClientUserDto & ClientUserInput,
    companyId: string,
    userId: string,
  ) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const modifiedDto = {
      name: dto.name,
      username: dto.username,
      password: hashedPassword,
      role: dto.role,
    };
    return super.create(modifiedDto, companyId, userId);
  }
}
