import { z } from 'zod';
import { OrderType } from './order.entity';
import { CreateOrderItemsSchema } from '../orderItems/orderItems.schema';

export const CreateOrderSchema = z.object({
  id: z.uuid().optional(),
  type: z.enum(OrderType),
  date: z.date().optional(),
  warehouseId: z.uuid(),
  partnerId: z.uuid().optional().nullable(),
  items: z.array(CreateOrderItemsSchema),
});

export const UpdateOrderSchema = CreateOrderSchema.partial();

export const CreateTransferSchema = z.object({
  warehouseFrom: z.uuid(),
  warehouseTo: z.uuid(),
  items: z.array(CreateOrderItemsSchema),
});
