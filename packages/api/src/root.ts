import { router, publicProcedure } from './trpc';
export { createTRPCContext } from './trpc';
import { prisma } from '@hotzy/database';
import { productRouter } from './routers/product';
import { categoryRouter } from './routers/category';
import { orderRouter } from './routers/order';
import { customerRouter } from './routers/customer';
import { customerAuthRouter } from './routers/customer-auth';
import { customerOrderRouter } from './routers/customer-order';
import { promoRouter } from './routers/promo';
import { campaignRouter } from './routers/campaign';
import { dashboardRouter } from './routers/dashboard';
import { authRouter } from './routers/auth';
import { productAdminRouter } from './routers/product-admin';
import { orderAdminRouter } from './routers/order-admin';
import { settingsRouter, teamRouter } from './routers/settings';
import { categoryAdminRouter } from './routers/category-admin';
import { customerAnalyticsRouter } from './routers/customer-analytics';
import { z } from 'zod';

export const appRouter = router({
  product: productRouter,
  category: categoryRouter,
  order: orderRouter,
  customerAuth: customerAuthRouter,
  customerOrder: customerOrderRouter,
  recordPageView: publicProcedure
    .input(
      z.object({
        path: z.string().min(1).max(2048),
        referrer: z.string().max(2048).optional(),
        userAgent: z.string().max(2048).optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const userAgent = ctx.req?.headers?.get('user-agent') || input.userAgent || null;
        await prisma.pageView.create({
          data: {
            path: input.path,
            customerId: ctx.customer?.id,
            referrer: input.referrer || null,
            userAgent,
          },
        });
      } catch {
        // Silently fail — analytics should never break the user experience
      }
    }),
  promoValidate: publicProcedure
    .input(z.object({ code: z.string(), subtotal: z.number() }))
    .query(async ({ input }) => {
      const promo = await prisma.promoCode.findUnique({
        where: { code: input.code.toUpperCase() },
      });
      if (!promo || promo.status !== 'ACTIVE') return { valid: false, discountAmount: 0 };
      const now = new Date();
      if (promo.startsAt && promo.startsAt > now) return { valid: false, discountAmount: 0 };
      if (promo.expiresAt && promo.expiresAt < now) return { valid: false, discountAmount: 0 };
      if (promo.maxUses && promo.currentUses >= promo.maxUses)
        return { valid: false, discountAmount: 0 };
      if (promo.minOrderAmount && input.subtotal < Number(promo.minOrderAmount))
        return { valid: false, discountAmount: 0 };

      let discountAmount = 0;
      if (promo.type === 'PERCENTAGE') {
        discountAmount = Math.min((input.subtotal * Number(promo.value)) / 100, input.subtotal);
      } else if (promo.type === 'FIXED_AMOUNT') {
        discountAmount = Math.min(Number(promo.value), input.subtotal);
      }

      return { valid: true, discountAmount, code: promo.code };
    }),
  campaign: router({
    active: publicProcedure.query(async () => {
      return prisma.campaign.findMany({
        where: { status: 'LIVE' },
        orderBy: { sortOrder: 'asc' },
      });
    }),
  }),
  team: router({
    list: publicProcedure.query(async () => {
      return prisma.teamMember.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      });
    }),
  }),
  settings: router({
    get: publicProcedure.query(async () => {
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
  }),
  admin: router({
    auth: authRouter,
    dashboard: dashboardRouter,
    product: productAdminRouter,
    order: orderAdminRouter,
    customer: customerRouter,
    promo: promoRouter,
    campaign: campaignRouter,
    settings: settingsRouter,
    team: teamRouter,
    category: categoryAdminRouter,
    analytics: customerAnalyticsRouter,
  }),
});

export type AppRouter = typeof appRouter;
