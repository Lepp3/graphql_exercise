import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { Invoice } from './invoice.entity';
import { BaseService } from 'src/common/base.service';
import { z } from 'zod';
import { CreateInvoiceSchema, UpdateInvoiceSchema } from './invoice.schema';
import { AuthUser } from 'src/decorators/currentUser.decorator';
import { OrderService } from '../order/order.service';
import { validateUniqueField } from 'src/common/validators/uniqueName.validator';

export type CreateInvoiceInput = z.infer<typeof CreateInvoiceSchema>;
export type UpdateInvoiceInput = z.infer<typeof UpdateInvoiceSchema>;

@Injectable()
export class InvoiceService extends BaseService<Invoice> {
  constructor(
    @InjectRepository(Invoice) repo: Repository<Invoice>,
    private readonly orderService: OrderService,
  ) {
    super(repo);
  }

  async create(user: AuthUser, dto: CreateInvoiceInput) {
    await this.orderService.getById(dto.orderId, user.companyId);
    await validateUniqueField(
      this.repo,
      { invoiceNumber: dto.invoiceNumber },
      'Invoice Number',
    );
    const invoice = this.repo.create(dto);
    return this.repo.save(invoice);
  }

  async getByCompanyId(companyId: string): Promise<Invoice[]> {
    return this.repo.find({
      where: { companyId },
    } as FindManyOptions<Invoice>);
  }

  async findAllByOrderId(orderId: string): Promise<Invoice[]> {
    return this.repo.find({ where: { orderId } } as FindManyOptions<Invoice>);
  }

  async update(
    user: AuthUser,
    id: string,
    dto: UpdateInvoiceInput,
  ): Promise<Invoice> {
    const invoice = await this.getById(id);
    if (invoice) {
      await this.orderService.getById(invoice.orderId, user.companyId);
    }
    if (dto.invoiceNumber) {
      await validateUniqueField(
        this.repo,
        { invoiceNumber: dto.invoiceNumber },
        'Invoice Number',
      );
    }
    Object.assign(invoice, dto);
    invoice.modifiedBy = user.id;
    return this.repo.save(invoice);
  }
}
