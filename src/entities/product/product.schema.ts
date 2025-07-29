import { z } from 'zod';
import { SupportType } from '../warehouse/warehouse.entity';
import { createZodDto } from 'nestjs-zod';

export const CreateProductSchema = z.object({
  id: z.uuid().optional(),
  name: z.string().min(1),
  type: z.enum(SupportType),
  code: z.string().min(1),
  price: z.string(),
  companyId: z.uuid(),
});

export const UpdateProductSchema = CreateProductSchema.partial();
export class CreateProductDto extends createZodDto(CreateProductSchema) {}
export class UpdateProductDto extends createZodDto(UpdateProductSchema) {}
