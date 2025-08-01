import { z } from 'zod';
import { SupportType } from './warehouse.entity';

export const CreateWarehouseSchema = z.object({
  id: z.uuid().optional(),
  name: z.string().min(1),
  supportType: z.enum(SupportType),
});

export const UpdateWarehouseSchema = CreateWarehouseSchema.partial().omit({
  supportType: true,
});
