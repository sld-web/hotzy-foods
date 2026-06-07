import { router, publicProcedure, adminProcedure } from '../trpc';
import { prisma } from '@hotzy/database';
import { z } from 'zod';

const campaignInput = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(['LIVE', 'DRAFT']).default('DRAFT'),
  imageUrl: z.string().optional(),
  placement: z.string().min(1),
  linkUrl: z.string().optional(),
  sortOrder: z.number().int().default(0),
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
});

export const campaignRouter = router({
  list: adminProcedure.query(async () => {
    return prisma.campaign.findMany({ orderBy: { sortOrder: 'asc' } });
  }),

  active: publicProcedure.query(async () => {
    return prisma.campaign.findMany({
      where: { status: 'LIVE' },
      orderBy: { sortOrder: 'asc' },
    });
  }),

  create: adminProcedure.input(campaignInput).mutation(async ({ input }) => {
    return prisma.campaign.create({
      data: {
        ...input,
        startsAt: input.startsAt ? new Date(input.startsAt) : null,
        endsAt: input.endsAt ? new Date(input.endsAt) : null,
      },
    });
  }),

  update: adminProcedure
    .input(campaignInput.partial().extend({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return prisma.campaign.update({
        where: { id },
        data: {
          ...data,
          startsAt: data.startsAt ? new Date(data.startsAt) : undefined,
          endsAt: data.endsAt ? new Date(data.endsAt) : undefined,
        },
      });
    }),

  delete: adminProcedure.input(z.object({ id: z.string() })).mutation(async ({ input }) => {
    return prisma.campaign.delete({ where: { id: input.id } });
  }),
});
