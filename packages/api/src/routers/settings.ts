import { router, adminProcedure } from '../trpc';
import { prisma } from '@hotzy/database';
import { z } from 'zod';

export const settingsRouter = router({
  get: adminProcedure.query(async () => {
    return prisma.siteSettings.findUnique({ where: { id: 'singleton' } });
  }),

  update: adminProcedure.input(z.any()).mutation(async ({ input }) => {
    return prisma.siteSettings.update({
      where: { id: 'singleton' },
      data: input,
    });
  }),
});

export const teamRouter = router({
  list: adminProcedure.query(async () => {
    return prisma.teamMember.findMany({ orderBy: { sortOrder: 'asc' } });
  }),

  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        role: z.string().min(1),
        photoUrl: z.string().optional(),
        bio: z.string().optional(),
        sortOrder: z.number().int().default(0),
      }),
    )
    .mutation(async ({ input }) => {
      return prisma.teamMember.create({ data: input });
    }),

  delete: adminProcedure.input(z.object({ id: z.string() })).mutation(async ({ input }) => {
    return prisma.teamMember.delete({ where: { id: input.id } });
  }),
});
