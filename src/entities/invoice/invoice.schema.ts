import { z } from 'zod';

export const CreateInvoiceSchema = z.object({
  id: z.uuid().optional(),
  date: z.date(),
  orderId: z.uuid(),
  invoiceNumber: z.string().min(4),
  userId: z.uuid(),
});

export const UpdateInvoiceSchema = CreateInvoiceSchema.partial();
