import { router, publicProcedure, adminProcedure } from '../trpc';
import { prisma } from '@hotzy/database';
import { z } from 'zod';

const settingsSchema = z.object({
  brandName: z.string().min(1).optional(),
  tagline: z.string().optional(),
  logoUrl: z.string().optional().nullable(),
  faviconUrl: z.string().optional().nullable(),
  heroImageUrl: z.string().optional(),
  heroTitle: z.string().optional(),
  heroDescription: z.string().optional(),
  heroCtaText: z.string().optional(),
  heroCtaUrl: z.string().optional(),
  currency: z.string().optional(),
  currencySymbol: z.string().optional(),
  taxRate: z.number().min(0).optional(),
  shippingBase: z.number().min(0).optional(),
  freeShippingThreshold: z.number().min(0).optional().nullable(),
  socialLinks: z.any().optional(),
  contactEmail: z.string().email().optional().nullable(),
  contactPhone: z.string().optional().nullable(),
  contactWhatsApp: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
});

export const settingsRouter = router({
  get: adminProcedure.query(async () => {
    return prisma.siteSettings.findUnique({ where: { id: 'singleton' } });
  }),

  getPublic: publicProcedure.query(async () => {
    const settings = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } });
    if (!settings) return null;
    return {
      brandName: settings.brandName,
      tagline: settings.tagline,
      logoUrl: settings.logoUrl,
      faviconUrl: settings.faviconUrl,
      heroImageUrl: settings.heroImageUrl,
      heroTitle: settings.heroTitle,
      heroDescription: settings.heroDescription,
      heroCtaText: settings.heroCtaText,
      heroCtaUrl: settings.heroCtaUrl,
      currency: settings.currency,
      currencySymbol: settings.currencySymbol,
      freeShippingThreshold: settings.freeShippingThreshold
        ? Number(settings.freeShippingThreshold)
        : null,
      contactEmail: settings.contactEmail,
      contactPhone: settings.contactPhone,
      contactWhatsApp: settings.contactWhatsApp,
      address: settings.address,
    };
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

  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        role: z.string().min(1).optional(),
        photoUrl: z.string().optional(),
        bio: z.string().optional(),
        sortOrder: z.number().int().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return prisma.teamMember.update({ where: { id }, data });
    }),

  delete: adminProcedure.input(z.object({ id: z.string() })).mutation(async ({ input }) => {
    return prisma.teamMember.delete({ where: { id: input.id } });
  }),
});
