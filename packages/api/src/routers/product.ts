import { TRPCError } from '@trpc/server';
import { router, publicProcedure } from '../trpc';
import { prisma } from '@hotzy/database';
import { productFilterSchema } from '@hotzy/validators';
import { z } from 'zod';

export const productRouter = router({
  list: publicProcedure.input(productFilterSchema).query(async ({ input }) => {
    const { category, heatLevel, search, sort, page, limit } = input;
    const skip = (page - 1) * limit;

    const where: any = { isActive: true };
    if (category) where.category = { slug: category };
    if (heatLevel) where.heatLevel = heatLevel;
    if (search) where.name = { contains: search, mode: 'insensitive' };

    const orderBy: any = {};
    switch (sort) {
      case 'name_asc':
        orderBy.name = 'asc';
        break;
      case 'name_desc':
        orderBy.name = 'desc';
        break;
      case 'price_asc':
        orderBy.price = 'asc';
        break;
      case 'price_desc':
        orderBy.price = 'desc';
        break;
      case 'newest':
        orderBy.createdAt = 'desc';
        break;
      case 'oldest':
        orderBy.createdAt = 'asc';
        break;
      default:
        orderBy.createdAt = 'desc';
    }

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { images: { orderBy: { sortOrder: 'asc' } }, category: true },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return { items, total, page, totalPages: Math.ceil(total / limit) };
  }),

  bySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
    const product = await prisma.product.findUnique({
      where: { slug: input.slug },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        category: true,
      },
    });
    if (!product) throw new TRPCError({ code: 'NOT_FOUND', message: 'Product not found' });
    return product;
  }),

  featured: publicProcedure.query(async () => {
    return prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      include: { images: { orderBy: { sortOrder: 'asc' } }, category: true },
      take: 8,
    });
  }),
});
