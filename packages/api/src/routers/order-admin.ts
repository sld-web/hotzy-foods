import { router, adminProcedure } from '../trpc';
import { prisma } from '@hotzy/database';
import { orderFilterSchema, updateOrderStatusSchema } from '@hotzy/validators';
import { z } from 'zod';

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
    const updateData: any = { status: input.status };
    if (input.status === 'SHIPPED') updateData.shippedAt = new Date();
    if (input.status === 'COMPLETED') updateData.paidAt = new Date();
    return prisma.order.update({
      where: { id: input.id },
      data: updateData,
    });
  }),
});
