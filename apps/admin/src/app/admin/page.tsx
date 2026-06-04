'use client';

import { KpiCard } from '@hotzy/ui';

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-headline-lg text-on-surface mb-6">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard title="Total Sales" value="Rs. 124,500.00" trend={{ value: '14.5%', positive: true }} icon="trending_up" />
        <KpiCard title="Orders" value="1,240" trend={{ value: '8.2%', positive: true }} icon="shopping_cart" />
        <KpiCard title="New Customers" value="342" trend={{ value: '12.3%', positive: true }} icon="person_add" />
        <KpiCard title="Avg Order Value" value="Rs. 100.40" trend={{ value: '2.1%', positive: false }} icon="account_balance" />
      </div>

      {/* Placeholder for charts and tables */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-surface-container p-6">
          <h2 className="text-headline-md text-on-surface mb-4">Sales Overview</h2>
          <div className="h-64 flex items-center justify-center text-on-surface-variant">
            Sales chart (Recharts) will render here
          </div>
        </div>
        <div className="bg-white rounded-xl border border-surface-container p-6">
          <h2 className="text-headline-md text-on-surface mb-4">Top Products</h2>
          <div className="space-y-3">
            {['Snake Bite Hot Sauce', "Dragon's Fury", 'Mango Tango Jam', 'Savvy Samurai Teriyaki'].map(
              (product, i) => (
                <div key={product} className="flex items-center justify-between py-2 border-b border-surface-container/50 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-label-sm text-on-surface-variant w-5">{i + 1}.</span>
                    <span className="text-body-md text-on-surface">{product}</span>
                  </div>
                  <span className="text-label-sm text-on-surface-variant">Rs. {(12 - i * 2) * 1000}</span>
                </div>
              ),
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-surface-container p-6">
        <h2 className="text-headline-md text-on-surface mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-container">
                <th className="text-left px-4 py-3 text-label-sm text-on-surface-variant">Order</th>
                <th className="text-left px-4 py-3 text-label-sm text-on-surface-variant">Customer</th>
                <th className="text-left px-4 py-3 text-label-sm text-on-surface-variant">Status</th>
                <th className="text-left px-4 py-3 text-label-sm text-on-surface-variant">Total</th>
              </tr>
            </thead>
            <tbody>
              {[
                { order: '#HZ-8892', customer: 'Sarah Jenkins', status: 'Completed', total: 'Rs. 3,150' },
                { order: '#HZ-8891', customer: 'Michael Chang', status: 'Processing', total: 'Rs. 5,200' },
                { order: '#HZ-8890', customer: 'Elena Rodriguez', status: 'Shipped', total: 'Rs. 2,450' },
              ].map((row) => (
                <tr key={row.order} className="border-b border-surface-container/50">
                  <td className="px-4 py-3 text-body-md text-on-surface">{row.order}</td>
                  <td className="px-4 py-3 text-body-md text-on-surface">{row.customer}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2.5 py-0.5 rounded-full text-label-sm bg-fresh-mint/15 text-tertiary">
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-body-md text-on-surface">{row.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
