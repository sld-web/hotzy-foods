import { router, adminProcedure } from '../trpc';
import { prisma } from '@hotzy/database';
import { z } from 'zod';

export const dashboardRouter = router({
  stats: adminProcedure
    .input(z.object({ period: z.enum(['7d', '30d', '90d', '1y']).default('30d') }))
    .query(async ({ input }) => {
      const daysMap = { '7d': 7, '30d': 30, '90d': 90, '1y': 365 };
      const since = new Date(Date.now() - daysMap[input.period] * 24 * 60 * 60 * 1000);

      const [totalSalesResult, ordersResult, customersResult, aovResult] = await Promise.all([
        prisma.order.aggregate({ _sum: { total: true }, where: { createdAt: { gte: since } } }),
        prisma.order.count({ where: { createdAt: { gte: since } } }),
        prisma.customer.count({ where: { createdAt: { gte: since } } }),
        prisma.order.aggregate({
          _avg: { total: true },
          where: { createdAt: { gte: since } },
        }),
      ]);

      return {
        totalSales: totalSalesResult._sum.total || 0,
        orders: ordersResult,
        newCustomers: customersResult,
        avgOrderValue: aovResult._avg.total || 0,
      };
    }),

  salesChart: adminProcedure
    .input(z.object({ days: z.number().int().min(1).max(365).default(30) }))
    .query(async ({ input }) => {
      const since = new Date(Date.now() - input.days * 24 * 60 * 60 * 1000);
      const orders = await prisma.order.findMany({
        where: { createdAt: { gte: since } },
        select: { total: true, createdAt: true },
        orderBy: { createdAt: 'asc' },
      });

      // Group by date
      const grouped: Record<string, number> = {};
      for (const order of orders) {
        const date = order.createdAt.toISOString().split('T')[0];
        grouped[date] = (grouped[date] || 0) + Number(order.total);
      }

      return Object.entries(grouped).map(([date, sales]) => ({ date, sales }));
    }),

  topProducts: adminProcedure.query(async () => {
    const items = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true, subtotal: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 10,
    });

    const productIds = items.map((i: any) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { images: { take: 1 } },
    });

    return items.map((item: any) => {
      const product = products.find((p: any) => p.id === item.productId);
      return {
        product,
        totalSold: item._sum.quantity || 0,
        totalRevenue: item._sum.subtotal || 0,
      };
    });
  }),

  recentOrders: adminProcedure.query(async () => {
    return prisma.order.findMany({
      include: { items: { include: { product: true } }, customer: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
  }),
});
