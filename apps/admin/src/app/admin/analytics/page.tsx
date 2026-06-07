'use client';

import { useMemo } from 'react';
import { trpc } from '@/lib/trpc';

const TIME_SEGMENTS = [
  { label: 'Morning (6am - 12pm)', start: 6, end: 12, color: 'bg-primary' },
  { label: 'Afternoon (12pm - 5pm)', start: 12, end: 17, color: 'bg-golden-glaze' },
  { label: 'Evening (5pm - 10pm)', start: 17, end: 22, color: 'bg-fresh-mint' },
  { label: 'Night (10pm - 6am)', start: 22, end: 6, color: 'bg-chili-red' },
];

function groupHours(data: { hour: number; count: number }[] | undefined) {
  if (!data) return [];
  return TIME_SEGMENTS.map((seg) => {
    let count = 0;
    for (const d of data) {
      if (seg.start <= seg.end) {
        if (d.hour >= seg.start && d.hour < seg.end) count += d.count;
      } else {
        if (d.hour >= seg.start || d.hour < seg.end) count += d.count;
      }
    }
    return { label: seg.label, count, color: seg.color };
  }).filter((s) => s.count > 0);
}

function Bar({
  value,
  max,
  label,
  color = 'bg-primary',
}: {
  value: number;
  max: number;
  label: string;
  color?: string;
}) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-36 text-right text-label-sm text-on-surface-variant shrink-0">
        {label}
      </span>
      <div className="flex-1 h-5 bg-surface-container rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-16 text-left text-label-sm text-on-surface font-medium">
        {value.toLocaleString()}
      </span>
    </div>
  );
}

function SegmentCard({
  label,
  count,
  max,
  color,
}: {
  label: string;
  count: number;
  max: number;
  color: string;
}) {
  const pct = max > 0 ? (count / max) * 100 : 0;
  return (
    <div className="bg-surface-container/40 rounded-xl p-4 flex flex-col gap-2">
      <span className="text-label-sm text-on-surface-variant">{label}</span>
      <div className="flex items-end justify-between gap-3">
        <span className="text-headline-md text-on-surface font-bold">{count.toLocaleString()}</span>
        {max > 0 && (
          <span className="text-label-sm text-on-surface-variant">{Math.round(pct)}%</span>
        )}
      </div>
      <div className="h-2 bg-surface-container-highest rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function KpiCard({ title, value, subtitle }: { title: string; value: string; subtitle?: string }) {
  return (
    <div className="bg-white rounded-xl border border-surface-container p-5">
      <p className="text-label-sm text-on-surface-variant mb-1">{title}</p>
      <p className="text-headline-md text-on-surface">{value}</p>
      {subtitle && <p className="text-label-sm text-on-surface-variant mt-1">{subtitle}</p>}
    </div>
  );
}

export default function AnalyticsPage() {
  const { data: trafficHour } = trpc.admin.analytics.trafficByHour.useQuery(undefined, {
    staleTime: 60_000,
  });
  const { data: trafficDow } = trpc.admin.analytics.trafficByDayOfWeek.useQuery(undefined, {
    staleTime: 60_000,
  });
  const { data: trafficDevice } = trpc.admin.analytics.trafficByDevice.useQuery(undefined, {
    staleTime: 60_000,
  });
  const { data: trafficPath } = trpc.admin.analytics.trafficByPath.useQuery(undefined, {
    staleTime: 60_000,
  });
  const { data: trafficTrend } = trpc.admin.analytics.trafficTrend.useQuery(undefined, {
    staleTime: 60_000,
  });

  const { data: ordersDow } = trpc.admin.analytics.ordersByDayOfWeek.useQuery(undefined, {
    staleTime: 60_000,
  });
  const { data: ordersHour } = trpc.admin.analytics.ordersByHour.useQuery(undefined, {
    staleTime: 60_000,
  });
  const { data: ordersDevice } = trpc.admin.analytics.ordersByDevice.useQuery(undefined, {
    staleTime: 60_000,
  });
  const { data: orderBuckets } = trpc.admin.analytics.orderValueBuckets.useQuery(undefined, {
    staleTime: 60_000,
  });

  const { data: ordersCity } = trpc.admin.analytics.ordersByCity.useQuery(undefined, {
    staleTime: 60_000,
  });
  const { data: ordersProvince } = trpc.admin.analytics.ordersByProvince.useQuery(undefined, {
    staleTime: 60_000,
  });

  const { data: customerMetrics } = trpc.admin.analytics.customerMetrics.useQuery(undefined, {
    staleTime: 60_000,
  });

  const trafficSegments = useMemo(() => groupHours(trafficHour), [trafficHour]);
  const orderSegments = useMemo(() => groupHours(ordersHour), [ordersHour]);
  const maxTrafficSeg = Math.max(...trafficSegments.map((s) => s.count), 1);
  const maxOrderSeg = Math.max(...orderSegments.map((s) => s.count), 1);

  const maxTrafficDow = Math.max(...(trafficDow?.map((t) => t.count) || [0]), 1);
  const maxOrderDow = Math.max(...(ordersDow?.map((t) => t.count) || [0]), 1);
  const maxCity = Math.max(...(ordersCity?.map((t) => t.count) || [0]), 1);
  const maxTrend = Math.max(...(trafficTrend?.map((t) => t.count) || [0]), 1);
  const maxTrafficDevice = Math.max(...(trafficDevice?.map((t) => t.count) || [0]), 1);
  const maxOrderDevice = Math.max(...(ordersDevice?.map((t) => t.count) || [0]), 1);
  const maxOrderBucket = Math.max(...(orderBuckets?.map((t) => t.count) || [0]), 1);
  const trafficPathTotal = useMemo(
    () => trafficPath?.reduce((s, x) => s + x.count, 0) || 0,
    [trafficPath],
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-headline-lg text-on-surface">Analytics</h1>
          <p className="text-body-md text-on-surface-variant">
            Customer insights, traffic patterns, and order analytics
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Traffic */}
        <div className="bg-white rounded-xl border border-surface-container p-6">
          <h2 className="text-headline-md text-on-surface mb-2">Website Traffic</h2>
          <p className="text-label-sm text-on-surface-variant mb-5">
            Page views tracked across the storefront
          </p>

          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-label-md text-on-surface font-semibold mb-3">
                Most Active Times
              </h3>
              {trafficSegments.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {trafficSegments.map((s) => (
                    <SegmentCard
                      key={s.label}
                      label={s.label}
                      count={s.count}
                      max={maxTrafficSeg}
                      color={s.color}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-label-sm text-on-surface-variant">No traffic data yet</p>
              )}
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-label-md text-on-surface font-semibold mb-3">Visits by Day</h3>
                <div className="space-y-1.5">
                  {trafficDow?.map((d) => (
                    <Bar key={d.day} label={d.day} value={d.count} max={maxTrafficDow} />
                  ))}
                  {(!trafficDow || trafficDow.length === 0) && (
                    <p className="text-label-sm text-on-surface-variant">No traffic data yet</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-label-md text-on-surface font-semibold mb-3">By Device</h3>
                <div className="space-y-1.5">
                  {trafficDevice?.map((d) => (
                    <Bar
                      key={d.device}
                      label={d.device}
                      value={d.count}
                      max={maxTrafficDevice}
                      color={
                        d.device === 'Mobile'
                          ? 'bg-primary'
                          : d.device === 'Tablet'
                            ? 'bg-golden-glaze'
                            : 'bg-fresh-mint'
                      }
                    />
                  ))}
                  {(!trafficDevice || trafficDevice.length === 0) && (
                    <p className="text-label-sm text-on-surface-variant">No device data yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-label-md text-on-surface font-semibold mb-3">
              Daily Trend (Last 90 Days)
            </h3>
            <div className="flex items-end gap-0.5 h-24">
              {trafficTrend?.map((d) => (
                <div
                  key={d.date}
                  className="flex-1 bg-primary/60 hover:bg-primary rounded-t transition-colors relative group"
                  style={{ height: `${(d.count / maxTrend) * 100}%` }}
                >
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-surface text-label-sm text-on-surface px-2 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    {d.date}: {d.count}
                  </div>
                </div>
              ))}
              {(!trafficTrend || trafficTrend.length === 0) && (
                <p className="text-label-sm text-on-surface-variant w-full text-center py-6">
                  No traffic data yet
                </p>
              )}
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-label-md text-on-surface font-semibold mb-3">Top Pages</h3>
            {trafficPath && trafficPath.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-surface-container">
                      <th className="px-3 py-2 text-label-sm text-on-surface-variant">Page</th>
                      <th className="px-3 py-2 text-label-sm text-on-surface-variant text-right">
                        Visits
                      </th>
                      <th className="px-3 py-2 text-label-sm text-on-surface-variant text-right">
                        %
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {trafficPath.map((p) => (
                      <tr
                        key={p.path}
                        className="border-b border-surface-container/50 hover:bg-surface-container/20"
                      >
                        <td className="px-3 py-2 text-body-md text-on-surface font-mono text-sm">
                          {p.path}
                        </td>
                        <td className="px-3 py-2 text-body-md text-on-surface text-right">
                          {p.count.toLocaleString()}
                        </td>
                        <td className="px-3 py-2 text-body-md text-on-surface-variant text-right">
                          {((p.count / trafficPathTotal) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-label-sm text-on-surface-variant">No page data yet</p>
            )}
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white rounded-xl border border-surface-container p-6">
          <h2 className="text-headline-md text-on-surface mb-2">Order Analytics</h2>
          <p className="text-label-sm text-on-surface-variant mb-5">
            Order patterns from checkout data
          </p>

          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-label-md text-on-surface font-semibold mb-3">
                Orders by Day of Week
              </h3>
              <div className="space-y-1.5">
                {ordersDow?.map((d) => (
                  <Bar key={d.day} label={d.day} value={d.count} max={maxOrderDow} />
                ))}
                {(!ordersDow || ordersDow.length === 0) && (
                  <p className="text-label-sm text-on-surface-variant">No order data yet</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-label-md text-on-surface font-semibold mb-3">Peak Order Times</h3>
              {orderSegments.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {orderSegments.map((s) => (
                    <SegmentCard
                      key={s.label}
                      label={s.label}
                      count={s.count}
                      max={maxOrderSeg}
                      color={s.color}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-label-sm text-on-surface-variant">No order data yet</p>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mt-8">
            <div>
              <h3 className="text-label-md text-on-surface font-semibold mb-3">Orders by Device</h3>
              <div className="space-y-1.5">
                {ordersDevice?.map((d) => (
                  <Bar
                    key={d.device}
                    label={d.device}
                    value={d.count}
                    max={maxOrderDevice}
                    color={
                      d.device === 'Mobile'
                        ? 'bg-primary'
                        : d.device === 'Tablet'
                          ? 'bg-golden-glaze'
                          : 'bg-fresh-mint'
                    }
                  />
                ))}
                {(!ordersDevice || ordersDevice.length === 0) && (
                  <p className="text-label-sm text-on-surface-variant">No device data yet</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-label-md text-on-surface font-semibold mb-3">
                Order Value Distribution
              </h3>
              <div className="space-y-1.5">
                {orderBuckets?.map((b) => (
                  <Bar
                    key={b.bucket}
                    label={b.bucket}
                    value={b.count}
                    max={maxOrderBucket}
                    color="bg-fresh-mint"
                  />
                ))}
                {(!orderBuckets || orderBuckets.length === 0) && (
                  <p className="text-label-sm text-on-surface-variant">No order data yet</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Geography */}
        <div className="bg-white rounded-xl border border-surface-container p-6">
          <h2 className="text-headline-md text-on-surface mb-2">Geographic Distribution</h2>
          <p className="text-label-sm text-on-surface-variant mb-5">
            Where orders are being shipped
          </p>

          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-label-md text-on-surface font-semibold mb-3">Top Cities</h3>
              <div className="space-y-1.5">
                {ordersCity?.map((c) => (
                  <Bar
                    key={c.city}
                    label={c.city}
                    value={c.count}
                    max={maxCity}
                    color="bg-chili-red"
                  />
                ))}
                {(!ordersCity || ordersCity.length === 0) && (
                  <p className="text-label-sm text-on-surface-variant">No order data yet</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-label-md text-on-surface font-semibold mb-3">By Province</h3>
              {ordersProvince && ordersProvince.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-surface-container">
                        <th className="px-3 py-2 text-label-sm text-on-surface-variant">
                          Province
                        </th>
                        <th className="px-3 py-2 text-label-sm text-on-surface-variant text-right">
                          Orders
                        </th>
                        <th className="px-3 py-2 text-label-sm text-on-surface-variant text-right">
                          Revenue
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {ordersProvince.map((p) => (
                        <tr
                          key={p.province}
                          className="border-b border-surface-container/50 hover:bg-surface-container/20"
                        >
                          <td className="px-3 py-2 text-body-md text-on-surface">{p.province}</td>
                          <td className="px-3 py-2 text-body-md text-on-surface text-right">
                            {p.count.toLocaleString()}
                          </td>
                          <td className="px-3 py-2 text-body-md text-on-surface text-right">
                            Rs. {p.revenue.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-label-sm text-on-surface-variant">No order data yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Customer Metrics */}
        <div className="bg-white rounded-xl border border-surface-container p-6">
          <h2 className="text-headline-md text-on-surface mb-5">Customer Overview</h2>

          {customerMetrics ? (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <KpiCard
                  title="Registered Customers"
                  value={customerMetrics.totalCustomers.toLocaleString()}
                />
                <KpiCard
                  title="Repeat Purchase Rate"
                  value={`${customerMetrics.repeatRate}%`}
                  subtitle={`${customerMetrics.repeatCustomers} of ${customerMetrics.totalCustomers} customers`}
                />
                <KpiCard
                  title="Total Orders"
                  value={customerMetrics.totalOrders.toLocaleString()}
                />
                <KpiCard
                  title="Avg Order Value"
                  value={`Rs. ${Math.round(customerMetrics.avgOrderValue).toLocaleString()}`}
                  subtitle={`Total: Rs. ${customerMetrics.totalRevenue.toLocaleString()}`}
                />
              </div>

              <div>
                <h3 className="text-label-md text-on-surface font-semibold mb-3">
                  Customer Segments
                </h3>
                {customerMetrics.segments.length > 0 ? (
                  <div className="space-y-1.5">
                    {customerMetrics.segments.map((s) => (
                      <Bar
                        key={s.segment}
                        label={s.segment}
                        value={s.count}
                        max={Math.max(...customerMetrics.segments.map((x) => x.count), 1)}
                        color="bg-chili-red"
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-label-sm text-on-surface-variant">No segments assigned yet</p>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
