import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const CreateOrderItemsSchema = z.object({
  id: z.uuid().optional(),
  productId: z.uuid(),
  quantity: z.coerce.number().positive(),
});

export const CreateOrderItemsWithOrderIdSchema = CreateOrderItemsSchema.extend({
  orderId: z.uuid(),
});

export const UpdateOrderItemsSchema = CreateOrderItemsSchema.partial();
export class UpdateOrderItemsDto extends createZodDto(UpdateOrderItemsSchema) {}
export class CreateOrderItemsDto extends createZodDto(CreateOrderItemsSchema) {}
export class CreateOrderItemsWithOrderIdDto extends createZodDto(
  CreateOrderItemsWithOrderIdSchema,
) {}
