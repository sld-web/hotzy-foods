import { router, publicProcedure, customerProcedure } from '../trpc';
import { prisma } from '@hotzy/database';
import { z } from 'zod';

export const customerOrderRouter = router({
  list: customerProcedure.query(async ({ ctx }) => {
    return prisma.order.findMany({
      where: { customerId: ctx.customer.id },
      include: { items: { include: { product: { include: { images: true } } } } },
      orderBy: { createdAt: 'desc' },
    });
  }),

  byId: customerProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const order = await prisma.order.findFirst({
      where: { id: input.id, customerId: ctx.customer.id },
      include: { items: { include: { product: { include: { images: true } } } } },
    });
    if (!order) throw new Error('Order not found');
    return order;
  }),

  trackByEmail: publicProcedure
    .input(z.object({ email: z.string().email(), orderNumber: z.string() }))
    .query(async ({ input }) => {
      const order = await prisma.order.findFirst({
        where: { orderNumber: input.orderNumber },
        include: {
          items: { include: { product: { include: { images: true } } } },
        },
      });
      if (!order) throw new Error('Order not found');
      if (!order.customerId) throw new Error('Order not found for this email');
      const customer = await prisma.customer.findUnique({ where: { id: order.customerId } });
      if (!customer || customer.email !== input.email)
        throw new Error('Order not found for this email');
      return order;
    }),
});
