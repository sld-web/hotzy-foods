import { z } from 'zod';

export const customerFilterSchema = z.object({
  search: z.string().optional(),
  segment: z.string().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

export const createAddressSchema = z.object({
  label: z.string().optional(),
  name: z.string().min(1),
  phone: z.string().min(1),
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  province: z.string().min(1),
  isDefault: z.boolean().default(false),
});

export const updateAddressSchema = createAddressSchema.partial();

export type CustomerFilterInput = z.infer<typeof customerFilterSchema>;
export type CreateAddressInput = z.infer<typeof createAddressSchema>;
