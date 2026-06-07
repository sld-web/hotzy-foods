import { TRPCError } from '@trpc/server';
import { router, adminProcedure } from '../trpc';
import { prisma } from '@hotzy/database';
import { orderFilterSchema, updateOrderStatusSchema } from '@hotzy/validators';
import { z } from 'zod';

const VALID_TRANSITIONS: Record<string, string[]> = {
  PENDING: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['COMPLETED'],
  COMPLETED: [],
  CANCELLED: [],
};

export const orderAdminRouter = router({
  list: adminProcedure.input(orderFilterSchema).query(async ({ input }) => {
    const { status, search, page, limit } = input;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { shippingName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: { include: { product: { include: { images: true } } } },
          customer: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return { items, total, page, totalPages: Math.ceil(total / limit) };
  }),

  byId: adminProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
    return prisma.order.findUnique({
      where: { id: input.id },
      include: {
        items: { include: { product: { include: { images: true, category: true } } } },
        customer: true,
      },
    });
  }),

  updateStatus: adminProcedure.input(updateOrderStatusSchema).mutation(async ({ input }) => {
    return prisma.$transaction(async (tx) => {
      const current = await tx.order.findUnique({
        where: { id: input.id },
        select: { status: true },
      });
      if (!current) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Order not found' });
      }
      const allowed = VALID_TRANSITIONS[current.status];
      if (!allowed || !allowed.includes(input.status)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Cannot transition from ${current.status} to ${input.status}`,
        });
      }
      const updateData: Record<string, unknown> = { status: input.status };
      if (input.status === 'SHIPPED') updateData.shippedAt = new Date();
      if (input.status === 'COMPLETED') updateData.paidAt = new Date();
      return tx.order.update({
        where: { id: input.id },
        data: updateData,
      });
    });
  }),
});
