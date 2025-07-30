import { z } from 'zod';

export const CreateOrderItemsSchema = z.object({
  id: z.uuid().optional(),
  productId: z.uuid(),
  quantity: z.coerce.number().positive(),
});

export const CreateOrderItemsWithOrderIdSchema = CreateOrderItemsSchema.extend({
  orderId: z.uuid(),
});

export const UpdateOrderItemsSchema = CreateOrderItemsSchema.partial();
