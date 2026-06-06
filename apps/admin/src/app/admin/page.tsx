'use client';

import { trpc } from '@/lib/trpc';
import { KpiCard } from '@hotzy/ui';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useAuthStore } from '@/lib/auth-store';

export default function AdminDashboardPage() {
  const user = useAuthStore((s) => s.user);

  const { data: stats } = trpc.admin.dashboard.stats.useQuery({ period: '30d' });
  const { data: salesChart } = trpc.admin.dashboard.salesChart.useQuery({ days: 30 });
  const { data: topProducts } = trpc.admin.dashboard.topProducts.useQuery();
  const { data: recentOrders } = trpc.admin.dashboard.recentOrders.useQuery();

  const formatCurrency = (value: unknown) => {
    if (value == null) return 'Rs. 0';
    const num = typeof value === 'object' ? Number(value) : Number(value);
    return `Rs. ${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-headline-lg text-on-surface">Dashboard</h1>
          {user && (
            <p className="text-body-md text-on-surface-variant">Welcome back, {user.name}</p>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard
          title="Total Sales"
          value={formatCurrency(stats?.totalSales)}
          trend={{ value: '+14.5%', positive: true }}
          icon="trending_up"
        />
        <KpiCard
          title="Orders"
          value={stats?.orders ?? 0}
          trend={{ value: '+8.2%', positive: true }}
          icon="shopping_cart"
        />
        <KpiCard
          title="New Customers"
          value={stats?.newCustomers ?? 0}
          trend={{ value: '+12.3%', positive: true }}
          icon="person_add"
        />
        <KpiCard
          title="Avg Order Value"
          value={formatCurrency(stats?.avgOrderValue)}
          trend={{ value: '-2.1%', positive: false }}
          icon="account_balance"
        />
      </div>

      {/* Sales Chart + Top Products */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Sales Chart */}
        <div className="bg-white rounded-xl border border-surface-container p-6">
          <h2 className="text-headline-md text-on-surface mb-4">Sales Overview</h2>
          {salesChart && salesChart.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12, fill: '#5b403f' }}
                  tickFormatter={(val) => {
                    const d = new Date(val);
                    return `${d.getDate()}/${d.getMonth() + 1}`;
                  }}
                />
                <YAxis tick={{ fontSize: 12, fill: '#5b403f' }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #eee',
                    fontSize: '14px',
                  }}
                  formatter={(value: any) => [formatCurrency(Number(value) || 0), 'Sales']}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#b20028"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#b20028' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-on-surface-variant">
              {salesChart ? 'No sales data yet' : 'Loading...'}
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl border border-surface-container p-6">
          <h2 className="text-headline-md text-on-surface mb-4">Top Products</h2>
          {topProducts && topProducts.length > 0 ? (
            <div className="space-y-3">
              {topProducts.map((item, i) => (
                <div
                  key={item.product?.id ?? i}
                  className="flex items-center justify-between py-2 border-b border-surface-container/50 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-label-sm text-on-surface-variant w-5">{i + 1}.</span>
                    <div>
                      <p className="text-body-md text-on-surface">
                        {item.product?.name ?? 'Unknown Product'}
                      </p>
                      <p className="text-label-sm text-on-surface-variant">{item.totalSold} sold</p>
                    </div>
                  </div>
                  <span className="text-label-sm text-on-surface-variant">
                    {formatCurrency(item.totalRevenue)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-on-surface-variant">
              {topProducts ? 'No products sold yet' : 'Loading...'}
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-surface-container p-6">
        <h2 className="text-headline-md text-on-surface mb-4">Recent Orders</h2>
        {recentOrders && recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-container">
                  <th className="text-left px-4 py-3 text-label-sm text-on-surface-variant">
                    Order
                  </th>
                  <th className="text-left px-4 py-3 text-label-sm text-on-surface-variant">
                    Customer
                  </th>
                  <th className="text-left px-4 py-3 text-label-sm text-on-surface-variant">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-label-sm text-on-surface-variant">
                    Date
                  </th>
                  <th className="text-right px-4 py-3 text-label-sm text-on-surface-variant">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-surface-container/50 hover:bg-surface-container/20"
                  >
                    <td className="px-4 py-3 text-body-md text-on-surface font-medium">
                      {order.orderNumber}
                    </td>
                    <td className="px-4 py-3 text-body-md text-on-surface">
                      {order.customer?.name ?? order.shippingName}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-label-sm capitalize ${
                          order.status === 'COMPLETED'
                            ? 'bg-fresh-mint/15 text-tertiary'
                            : order.status === 'PROCESSING'
                              ? 'bg-golden-glaze/20 text-secondary'
                              : order.status === 'SHIPPED'
                                ? 'bg-primary/10 text-primary'
                                : order.status === 'CANCELLED'
                                  ? 'bg-surface-variant text-on-surface-variant'
                                  : 'bg-error/15 text-error'
                        }`}
                      >
                        {order.status.toLowerCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-body-md text-on-surface">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-body-md text-on-surface text-right">
                      {formatCurrency(order.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-on-surface-variant">
            {recentOrders ? 'No orders yet' : 'Loading...'}
          </div>
        )}
      </div>
    </div>
  );
}
