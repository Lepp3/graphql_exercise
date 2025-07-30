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
} from './user.schema';
import * as bcrypt from 'bcrypt';
import { AuthUser } from 'src/decorators/currentUser.decorator';
import { validateUniqueField } from 'src/common/validators/uniqueName.validator';

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;

@Injectable()
export class UserService extends BaseService<User> {
  constructor(@InjectRepository(User) repo: Repository<User>) {
    super(repo);
  }

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
    dto: ClientUserInput,
    companyId: string,
    userId: string,
  ) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const modifiedDto = {
      name: dto.name,
      username: dto.username,
      password: hashedPassword,
      role: dto.role,
      companyId,
    };
    const user = this.repo.create(modifiedDto);
    user.modifiedBy = userId;
    return this.repo.save(user);
  }

  async update(user: AuthUser, id: string, dto: UpdateUserInput) {
    const userToUpdate = await this.getById(id);
    if (dto.username) {
      await validateUniqueField(
        this.repo,
        { username: dto.username },
        'User username',
      );
    }
    Object.assign(userToUpdate, dto);
    userToUpdate.modifiedBy = user.id;
    return this.repo.save(userToUpdate);
  }
}
