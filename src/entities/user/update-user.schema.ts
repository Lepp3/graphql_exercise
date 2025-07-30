import { z } from 'zod';
import { UserRole } from './user.entity';
import { createZodDto } from 'nestjs-zod';

export const CreateUserSchema = z.object({
  name: z.string().min(2),
  username: z.string().min(4),
  password: z.string().min(6),
  role: z.enum(UserRole),
  companyId: z.uuid(),
});

const ClientUserSchema = CreateUserSchema.omit({ companyId: true });
export class ClientUserDto extends createZodDto(ClientUserSchema) {}
export type ClientUserInput = z.infer<typeof ClientUserSchema>;

export const UpdateUserSchema = ClientUserSchema.partial();

export type RegisterUserInput = z.infer<typeof CreateUserSchema>;
export class CreateUserDto extends createZodDto(CreateUserSchema) {}
export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}
