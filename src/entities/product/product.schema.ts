import { z } from 'zod';
import { SupportType } from '../warehouse/warehouse.entity';

export const CreateProductSchema = z.object({
  id: z.uuid().optional(),
  name: z.string().min(1),
  type: z.enum(SupportType),
  code: z.string().min(1),
  price: z.string(),
  companyId: z.uuid(),
});

export const UpdateProductSchema = CreateProductSchema.partial();
