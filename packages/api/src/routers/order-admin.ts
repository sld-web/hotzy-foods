import { router, adminProcedure } from '../trpc';
import { prisma } from '@hotzy/database';
import { updateOrderStatusSchema } from '@hotzy/validators';

export const orderAdminRouter = router({
  list: adminProcedure.query(async () => {
    return prisma.order.findMany({
      include: {
        items: { include: { product: { include: { images: true } } } },
        customer: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }),

  updateStatus: adminProcedure.input(updateOrderStatusSchema).mutation(async ({ input }) => {
    const updateData: any = { status: input.status };
    if (input.status === 'SHIPPED') updateData.shippedAt = new Date();
    return prisma.order.update({
      where: { id: input.id },
      data: updateData,
    });
  }),
});
