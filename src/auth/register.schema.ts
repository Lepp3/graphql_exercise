import { z } from 'zod';

export const RegisterWithCompanySchema = z.object({
  companyName: z.string().min(4),
  companyLocation: z.string().min(4),
  name: z.string().min(2),
  username: z.string().min(4),
  password: z.string().min(6),
});

export type RegisterWithCompanyInput = z.infer<
  typeof RegisterWithCompanySchema
>;
