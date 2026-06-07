import { router, adminProcedure } from '../trpc';
import { prisma } from '@hotzy/database';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const customerAnalyticsRouter = router({
  ordersByDayOfWeek: adminProcedure.query(async () => {
    const rows = await prisma.$queryRaw<Array<{ dow: number; count: bigint; revenue: string }>>`
      SELECT EXTRACT(DOW FROM "createdAt") as dow, COUNT(*)::int as count, COALESCE(SUM(total), 0) as revenue
      FROM "Order"
      GROUP BY dow ORDER BY dow
    `;
    return rows.map((r) => ({
      day: DAY_NAMES[r.dow] || 'Unknown',
      count: Number(r.count),
      revenue: Number(r.revenue),
    }));
  }),

  ordersByHour: adminProcedure.query(async () => {
    const rows = await prisma.$queryRaw<Array<{ hour: number; count: bigint; revenue: string }>>`
      SELECT EXTRACT(HOUR FROM "createdAt") as hour, COUNT(*)::int as count, COALESCE(SUM(total), 0) as revenue
      FROM "Order"
      GROUP BY hour ORDER BY hour
    `;
    return rows.map((r) => ({
      hour: r.hour,
      count: Number(r.count),
      revenue: Number(r.revenue),
    }));
  }),

  ordersByCity: adminProcedure.query(async () => {
    const rows = await prisma.$queryRaw<Array<{ city: string; count: bigint; revenue: string }>>`
      SELECT "shippingCity" as city, COUNT(*)::int as count, COALESCE(SUM(total), 0) as revenue
      FROM "Order"
      GROUP BY city ORDER BY count DESC LIMIT 20
    `;
    return rows.map((r) => ({
      city: r.city,
      count: Number(r.count),
      revenue: Number(r.revenue),
    }));
  }),

  ordersByProvince: adminProcedure.query(async () => {
    const rows = await prisma.$queryRaw<
      Array<{ province: string | null; count: bigint; revenue: string }>
    >`
      SELECT "shippingProvince" as province, COUNT(*)::int as count, COALESCE(SUM(total), 0) as revenue
      FROM "Order"
      GROUP BY province ORDER BY count DESC
    `;
    return rows.map((r) => ({
      province: r.province || 'Unknown',
      count: Number(r.count),
      revenue: Number(r.revenue),
    }));
  }),

  ordersByDevice: adminProcedure.query(async () => {
    const rows = await prisma.$queryRaw<Array<{ device: string; count: bigint; revenue: string }>>`
      SELECT
        CASE
          WHEN "userAgent" ~* 'mobile|iphone|android(?!.*tablet)|windows phone|opera mini|blackberry' THEN 'Mobile'
          WHEN "userAgent" ~* 'tablet|ipad' THEN 'Tablet'
          ELSE 'Desktop'
        END as device,
        COUNT(*)::int as count,
        COALESCE(SUM(total), 0) as revenue
      FROM "Order"
      WHERE "userAgent" IS NOT NULL
      GROUP BY device ORDER BY count DESC
    `;
    return rows.map((r) => ({
      device: r.device,
      count: Number(r.count),
      revenue: Number(r.revenue),
    }));
  }),

  orderValueBuckets: adminProcedure.query(async () => {
    const rows = await prisma.$queryRaw<Array<{ bucket: string; count: bigint; total: string }>>`
      SELECT
        CASE
          WHEN total < 1000 THEN 'Under Rs 1,000'
          WHEN total < 2500 THEN 'Rs 1,000 - 2,500'
          WHEN total < 5000 THEN 'Rs 2,500 - 5,000'
          WHEN total < 10000 THEN 'Rs 5,000 - 10,000'
          ELSE 'Above Rs 10,000'
        END as bucket,
        COUNT(*)::int as count,
        COALESCE(SUM(total), 0) as total
      FROM "Order"
      GROUP BY bucket ORDER BY MIN(total)
    `;
    return rows.map((r) => ({
      bucket: r.bucket,
      count: Number(r.count),
      total: Number(r.total),
    }));
  }),

  customerMetrics: adminProcedure.query(async () => {
    const [totalCustomers, repeatCustomers, segmentRows, totalOrders, totalRevenue] =
      await Promise.all([
        prisma.customer.count({ where: { isGuest: false } }),
        prisma.$queryRaw<Array<{ count: bigint }>>`
          SELECT COUNT(*)::int as count FROM (
            SELECT "customerId" FROM "Order" WHERE "customerId" IS NOT NULL GROUP BY "customerId" HAVING COUNT(*) > 1
          ) as repeaters
        `,
        prisma.$queryRaw<Array<{ segment: string | null; count: bigint }>>`
          SELECT segment, COUNT(*)::int as count FROM "Customer" GROUP BY segment ORDER BY count DESC
        `,
        prisma.order.count(),
        prisma.$queryRaw<Array<{ total: string }>>`
          SELECT COALESCE(SUM(total), 0) as total FROM "Order"
        `,
      ]);

    return {
      totalCustomers,
      repeatCustomers: Number(repeatCustomers[0]?.count || 0),
      repeatRate:
        totalCustomers > 0
          ? Math.round((Number(repeatCustomers[0]?.count || 0) / totalCustomers) * 100)
          : 0,
      totalOrders,
      totalRevenue: Number(totalRevenue[0]?.total || 0),
      avgOrderValue: totalOrders > 0 ? Number(totalRevenue[0]?.total || 0) / totalOrders : 0,
      segments: segmentRows.map((r) => ({
        segment: r.segment || 'Unassigned',
        count: Number(r.count),
      })),
    };
  }),

  trafficByHour: adminProcedure.query(async () => {
    const rows = await prisma.$queryRaw<Array<{ hour: number; count: bigint }>>`
      SELECT EXTRACT(HOUR FROM "createdAt") as hour, COUNT(*)::int as count
      FROM "PageView"
      GROUP BY hour ORDER BY hour
    `;
    return rows.map((r) => ({ hour: r.hour, count: Number(r.count) }));
  }),

  trafficByDayOfWeek: adminProcedure.query(async () => {
    const rows = await prisma.$queryRaw<Array<{ dow: number; count: bigint }>>`
      SELECT EXTRACT(DOW FROM "createdAt") as dow, COUNT(*)::int as count
      FROM "PageView"
      GROUP BY dow ORDER BY dow
    `;
    return rows.map((r) => ({
      day: DAY_NAMES[r.dow] || 'Unknown',
      count: Number(r.count),
    }));
  }),

  trafficByPath: adminProcedure.query(async () => {
    const rows = await prisma.$queryRaw<Array<{ path: string; count: bigint }>>`
      SELECT path, COUNT(*)::int as count
      FROM "PageView"
      GROUP BY path ORDER BY count DESC LIMIT 20
    `;
    return rows.map((r) => ({ path: r.path, count: Number(r.count) }));
  }),

  trafficTrend: adminProcedure.query(async () => {
    const rows = await prisma.$queryRaw<Array<{ date: Date; count: bigint }>>`
      SELECT DATE("createdAt") as date, COUNT(*)::int as count
      FROM "PageView"
      WHERE "createdAt" >= NOW() - INTERVAL '90 days'
      GROUP BY date ORDER BY date
    `;
    return rows.map((r) => ({ date: r.date.toISOString().slice(0, 10), count: Number(r.count) }));
  }),

  trafficByDevice: adminProcedure.query(async () => {
    const rows = await prisma.$queryRaw<Array<{ device: string; count: bigint }>>`
      SELECT
        CASE
          WHEN "userAgent" ~* 'mobile|iphone|android(?!.*tablet)|windows phone|opera mini|blackberry' THEN 'Mobile'
          WHEN "userAgent" ~* 'tablet|ipad' THEN 'Tablet'
          ELSE 'Desktop'
        END as device,
        COUNT(*)::int as count
      FROM "PageView"
      WHERE "userAgent" IS NOT NULL
      GROUP BY device ORDER BY count DESC
    `;
    return rows.map((r) => ({
      device: r.device,
      count: Number(r.count),
    }));
  }),
});
