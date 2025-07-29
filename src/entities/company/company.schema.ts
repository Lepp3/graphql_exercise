import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const CreateCompanySchema = z.object({
  id: z.uuid().optional(),
  name: z.string().min(1).describe('company name'),
  location: z.string().describe('company location'),
});

export const UpdateCompanySchema = CreateCompanySchema.partial();
export class CreateCompanyDto extends createZodDto(CreateCompanySchema) {}
export class UpdateCompanyDto extends createZodDto(UpdateCompanySchema) {}
