import { router } from './trpc';
export { createTRPCContext } from './trpc';
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

export const appRouter = router({
  product: productRouter,
  category: categoryRouter,
  order: orderRouter,
  customerAuth: customerAuthRouter,
  customerOrder: customerOrderRouter,
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
  }),
});

export type AppRouter = typeof appRouter;
