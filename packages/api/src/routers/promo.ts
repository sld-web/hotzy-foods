import { TRPCError } from '@trpc/server';
import { router, adminProcedure } from '../trpc';
import { prisma } from '@hotzy/database';
import { createPromoSchema, updatePromoSchema } from '@hotzy/validators';
import { z } from 'zod';

export const promoRouter = router({
  list: adminProcedure.query(async () => {
    return prisma.promoCode.findMany({ orderBy: { createdAt: 'desc' } });
  }),

  create: adminProcedure.input(createPromoSchema).mutation(async ({ input }) => {
    try {
      return await prisma.promoCode.create({
        data: {
          ...input,
          startsAt: input.startsAt ? new Date(input.startsAt) : null,
          expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
        },
      });
    } catch (error: unknown) {
      const prismaError = error as { code?: string };
      if (prismaError.code === 'P2002') {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'A promo code with this code already exists',
        });
      }
      throw error;
    }
  }),

  update: adminProcedure
    .input(updatePromoSchema.extend({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return prisma.promoCode.update({
        where: { id },
        data: {
          ...data,
          startsAt: data.startsAt ? new Date(data.startsAt) : undefined,
          expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
        },
      });
    }),

  delete: adminProcedure.input(z.object({ id: z.string() })).mutation(async ({ input }) => {
    return prisma.promoCode.delete({ where: { id: input.id } });
  }),
});
