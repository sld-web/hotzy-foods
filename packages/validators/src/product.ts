import { z } from 'zod';

// ─── Product ───
export const heatLevelEnum = z.enum(['MILD', 'MEDIUM', 'HOT', 'XTREME']);

export const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  slug: z.string().min(1).max(200),
  sku: z.string().min(1).max(50),
  description: z.string().min(1),
  price: z.number().positive(),
  compareAtPrice: z.number().positive().optional(),
  costPrice: z.number().positive().optional(),
  stockLevel: z.number().int().min(0).default(0),
  lowStockThreshold: z.number().int().min(1).default(10),
  heatLevel: heatLevelEnum.optional(),
  shuMin: z.number().int().optional(),
  shuMax: z.number().int().optional(),
  weight: z.number().positive().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isBestseller: z.boolean().default(false),
  isNew: z.boolean().default(false),
  dietaryTags: z.array(z.string()).default([]),
  metaTitle: z.string().max(60).optional(),
  metaDesc: z.string().max(160).optional(),
  categoryId: z.string().min(1),
  images: z
    .array(
      z.object({
        url: z.string().url(),
        alt: z.string().optional(),
        sortOrder: z.number().int().default(0),
      }),
    )
    .default([]),
});

export const updateProductSchema = createProductSchema.partial();

export const productFilterSchema = z.object({
  category: z.string().optional(),
  heatLevel: heatLevelEnum.optional(),
  search: z.string().optional(),
  sort: z.enum(['name_asc', 'name_desc', 'price_asc', 'price_desc', 'newest', 'oldest']).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(12),
});

export type CreateProductInput = z.input<typeof createProductSchema>;
export type UpdateProductInput = z.input<typeof updateProductSchema>;
export type ProductFilterInput = z.input<typeof productFilterSchema>;
