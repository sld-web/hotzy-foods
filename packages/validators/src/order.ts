import { z } from 'zod';

export const orderStatusEnum = z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'COMPLETED', 'CANCELLED']);

export const createOrderItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1),
  unitPrice: z.number().positive(),
});

export const createOrderSchema = z.object({
  items: z.array(createOrderItemSchema).min(1, 'At least one item is required'),
  shippingName: z.string().min(1, 'Shipping name is required'),
  shippingPhone: z.string().optional(),
  shippingAddress: z.string().min(1, 'Shipping address is required'),
  shippingCity: z.string().min(1, 'City is required'),
  shippingProvince: z.string().optional(),
  promoCode: z.string().optional(),
  notes: z.string().optional(),
  customerEmail: z.string().email().optional(),
  customerName: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  id: z.string().min(1),
  status: orderStatusEnum,
});

export const orderFilterSchema = z.object({
  status: orderStatusEnum.optional(),
  search: z.string().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type OrderFilterInput = z.infer<typeof orderFilterSchema>;
