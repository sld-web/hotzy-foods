import { router, publicProcedure } from '../trpc';
import { prisma } from '@hotzy/database';

export const categoryRouter = router({
  list: publicProcedure.query(async () => {
    return prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }),
});
