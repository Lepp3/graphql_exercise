import { z } from 'zod';
import { PartnerType } from './partner.entity';

export const CreatePartnerSchema = z.object({
  id: z.uuid().optional(),
  name: z.string().min(1),
  partnerType: z.enum(PartnerType),
  companyId: z.uuid(),
});

export const UpdatePartnerSchema = CreatePartnerSchema.partial();
