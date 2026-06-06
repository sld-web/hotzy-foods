import { router, publicProcedure, adminProcedure } from '../trpc';
import { prisma } from '@hotzy/database';
import { z } from 'zod';

const settingsSchema = z.object({
  brandName: z.string().min(1).optional(),
  tagline: z.string().optional(),
  logoUrl: z.string().optional(),
  faviconUrl: z.string().optional(),
  currency: z.string().optional(),
  currencySymbol: z.string().optional(),
  taxRate: z.number().min(0).optional(),
  shippingBase: z.number().min(0).optional(),
  freeShippingThreshold: z.number().min(0).optional(),
  socialLinks: z.any().optional(),
  contactEmail: z.string().email().optional().nullable(),
  contactPhone: z.string().optional().nullable(),
  contactWhatsApp: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
});

const publicSettingsSchema = z.object({
  brandName: z.string(),
  tagline: z.string(),
  logoUrl: z.string().nullable(),
  faviconUrl: z.string().nullable(),
  currency: z.string(),
  currencySymbol: z.string(),
  freeShippingThreshold: z.number().nullable(),
  contactEmail: z.string().nullable(),
  contactPhone: z.string().nullable(),
  contactWhatsApp: z.string().nullable(),
  address: z.string().nullable(),
});

export const settingsRouter = router({
  get: adminProcedure.query(async () => {
    return prisma.siteSettings.findUnique({ where: { id: 'singleton' } });
  }),

  getPublic: publicProcedure.query(async () => {
    const settings = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } });
    if (!settings) return null;
    return publicSettingsSchema.parse(settings);
  }),

  update: adminProcedure.input(settingsSchema).mutation(async ({ input }) => {
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

  listPublic: publicProcedure.query(async () => {
    return prisma.teamMember.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
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
