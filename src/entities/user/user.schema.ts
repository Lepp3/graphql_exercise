import { z } from 'zod';
import { UserRole } from './user.entity';

export const CreateUserSchema = z.object({
  name: z.string().min(2),
  username: z.string().min(4),
  password: z.string().min(6),
  role: z.enum(UserRole),
  companyId: z.uuid(),
});

export const ClientUserSchema = CreateUserSchema.omit({ companyId: true });

export type ClientUserInput = z.infer<typeof ClientUserSchema>;

export const UpdateUserSchema = ClientUserSchema.partial();

export type RegisterUserInput = z.infer<typeof CreateUserSchema>;
