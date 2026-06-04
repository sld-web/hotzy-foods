import { z } from 'zod';

export const promoTypeEnum = z.enum(['PERCENTAGE', 'FREE_SHIPPING', 'FIXED_AMOUNT']);
export const promoStatusEnum = z.enum(['ACTIVE', 'SCHEDULED', 'EXPIRED']);

export const createPromoSchema = z.object({
  code: z.string().min(1).max(50).transform((v) => v.toUpperCase()),
  type: promoTypeEnum,
  value: z.number().positive(),
  minOrderAmount: z.number().min(0).default(0),
  maxUses: z.number().int().positive().optional(),
  maxPerUser: z.number().int().positive().default(1),
  status: promoStatusEnum.default('ACTIVE'),
  startsAt: z.string().datetime().optional(),
  expiresAt: z.string().datetime().optional(),
  description: z.string().optional(),
});

export const updatePromoSchema = createPromoSchema.partial();

export type CreatePromoInput = z.infer<typeof createPromoSchema>;
export type UpdatePromoInput = z.infer<typeof updatePromoSchema>;
