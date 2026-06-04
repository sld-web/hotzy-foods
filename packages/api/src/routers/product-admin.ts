import { router, adminProcedure } from '../trpc';
import { prisma } from '@hotzy/database';
import { productFilterSchema, createProductSchema, updateProductSchema } from '@hotzy/validators';
import { z } from 'zod';

export const productAdminRouter = router({
  list: adminProcedure.input(productFilterSchema).query(async ({ input }) => {
    const { category, heatLevel, search, sort, page, limit } = input;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (category) where.category = { slug: category };
    if (heatLevel) where.heatLevel = heatLevel;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderBy: any = {};
    switch (sort) {
      case 'name_asc': orderBy.name = 'asc'; break;
      case 'name_desc': orderBy.name = 'desc'; break;
      case 'price_asc': orderBy.price = 'asc'; break;
      case 'price_desc': orderBy.price = 'desc'; break;
      case 'newest': orderBy.createdAt = 'desc'; break;
      case 'oldest': orderBy.createdAt = 'asc'; break;
      default: orderBy.createdAt = 'desc';
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

  create: adminProcedure.input(createProductSchema).mutation(async ({ input }) => {
    const { images, ...data } = input;
    return prisma.product.create({
      data: {
        ...data,
        images: { create: images },
      },
      include: { images: true, category: true },
    });
  }),

  update: adminProcedure
    .input(updateProductSchema.extend({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { id, images, ...data } = input;
      return prisma.product.update({
        where: { id },
        data: {
          ...data,
          images: images
            ? {
                deleteMany: {},
                create: images,
              }
            : undefined,
        },
        include: { images: true, category: true },
      });
    }),

  delete: adminProcedure.input(z.object({ id: z.string() })).mutation(async ({ input }) => {
    await prisma.productImage.deleteMany({ where: { productId: input.id } });
    return prisma.product.delete({ where: { id: input.id } });
  }),
});
