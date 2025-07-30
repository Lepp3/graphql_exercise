import { z } from 'zod';

export const CreateCompanySchema = z.object({
  id: z.uuid().optional(),
  name: z.string().min(1).describe('company name'),
  location: z.string().describe('company location'),
});

export const UpdateCompanySchema = CreateCompanySchema.partial();
