'use client';

import { StatusBadge, Button } from '@hotzy/ui';

export default function PromotionsPage() {
  const promos = [
    { code: 'HEATWAVE20', type: '20% Off', value: '20%', usage: '452 / 1000', status: 'active' as const },
    { code: 'FREESHIPSPICY', type: 'Free Shipping', value: '—', usage: '128 / Unlimited', status: 'active' as const },
    { code: 'WINTER5B', type: 'Rs. 500 Off', value: 'Rs. 500', usage: '1000 / 1000', status: 'expired' as const },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-headline-lg text-on-surface">Promotions</h1>
        <Button>Create New Promo</Button>
      </div>

      <div className="bg-white rounded-xl border border-surface-container overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-surface-gray border-b border-surface-container">
              <th className="text-left px-4 py-3 text-label-sm text-on-surface-variant">Code</th>
              <th className="text-left px-4 py-3 text-label-sm text-on-surface-variant">Type</th>
              <th className="text-left px-4 py-3 text-label-sm text-on-surface-variant">Value</th>
              <th className="text-left px-4 py-3 text-label-sm text-on-surface-variant">Usage</th>
              <th className="text-left px-4 py-3 text-label-sm text-on-surface-variant">Status</th>
            </tr>
          </thead>
          <tbody>
            {promos.map((promo) => (
              <tr key={promo.code} className="border-b border-surface-container/50">
                <td className="px-4 py-3 text-body-md text-on-surface font-semibold">{promo.code}</td>
                <td className="px-4 py-3 text-body-md text-on-surface">{promo.type}</td>
                <td className="px-4 py-3 text-body-md text-on-surface">{promo.value}</td>
                <td className="px-4 py-3 text-body-md text-on-surface">{promo.usage}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={promo.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
