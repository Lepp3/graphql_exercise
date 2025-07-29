import { z } from 'zod';
import { PartnerType } from './partner.entity';
import { createZodDto } from 'nestjs-zod';

export const CreatePartnerSchema = z.object({
  id: z.uuid().optional(),
  name: z.string().min(1),
  partnerType: z.enum(PartnerType),
  companyId: z.uuid(),
});

export const UpdatePartnerSchema = CreatePartnerSchema.partial();
export class CreatePartnerDto extends createZodDto(CreatePartnerSchema) {}
export class UpdatePartnerDto extends createZodDto(UpdatePartnerSchema) {}
