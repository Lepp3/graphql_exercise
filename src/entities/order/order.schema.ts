import { z } from 'zod';
import { OrderType } from './order.entity';
import { CreateOrderItemsSchema } from '../orderItems/orderItems.schema';

export const CreateOrderSchema = z.object({
  id: z.uuid().optional(),
  type: z.enum(OrderType),
  date: z.date(),
  warehouseId: z.uuid(),
  partnerId: z.uuid(),
  items: z.array(CreateOrderItemsSchema),
});

export const UpdateOrderSchema = CreateOrderSchema.partial();
