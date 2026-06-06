import { TRPCError } from '@trpc/server';
import { router, adminProcedure } from '../trpc';
import { prisma } from '@hotzy/database';
import { z } from 'zod';

export const categoryAdminRouter = router({
  list: adminProcedure.query(async () => {
    return prisma.category.findMany({ orderBy: { sortOrder: 'asc' } });
  }),

  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
        description: z.string().optional(),
        icon: z.string().optional(),
        sortOrder: z.number().int().default(0),
      }),
    )
    .mutation(async ({ input }) => {
      return prisma.category.create({ data: input });
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        slug: z.string().min(1).optional(),
        description: z.string().optional(),
        icon: z.string().optional(),
        sortOrder: z.number().int().optional(),
        isActive: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return prisma.category.update({ where: { id }, data });
    }),

  delete: adminProcedure.input(z.object({ id: z.string() })).mutation(async ({ input }) => {
    const productCount = await prisma.product.count({ where: { categoryId: input.id } });
    if (productCount > 0) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Cannot delete category with ${productCount} products. Reassign products first.`,
      });
    }
    return prisma.category.delete({ where: { id: input.id } });
  }),
});
