import { router, adminProcedure } from '../trpc';
import { prisma } from '@hotzy/database';
import { customerFilterSchema } from '@hotzy/validators';

export const customerRouter = router({
  list: adminProcedure.input(customerFilterSchema).query(async ({ input }) => {
    const { search, segment, page, limit } = input;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (segment) where.segment = segment;

    const [items, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.customer.count({ where }),
    ]);

    return { items, total, page, totalPages: Math.ceil(total / limit) };
  }),
});
