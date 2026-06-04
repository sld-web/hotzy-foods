'use client';

import { SearchBar, DataTable } from '@hotzy/ui';

export default function CustomersPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-headline-lg text-on-surface">Customer Insights</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg border border-outline-variant text-label-sm text-on-surface-variant hover:bg-surface-container transition-colors">
            Filter
          </button>
          <button className="px-4 py-2 rounded-lg border border-outline-variant text-label-sm text-on-surface-variant hover:bg-surface-container transition-colors">
            Export
          </button>
        </div>
      </div>

      <SearchBar placeholder="Search customers..." value="" onChange={() => {}} className="mb-4" />

      <DataTable
        columns={[
          { key: 'name', header: 'Name' },
          { key: 'email', header: 'Email' },
          { key: 'orders', header: 'Orders' },
          { key: 'spent', header: 'Total Spent' },
          { key: 'segment', header: 'Segment' },
        ]}
        data={[
          { id: '1', name: 'Sarah Jenkins', email: 'sarah@example.com', orders: 28, spent: 'Rs. 1,245.00', segment: 'VIP - High Spender' },
          { id: '2', name: 'Michael Chang', email: 'michael@example.com', orders: 15, spent: 'Rs. 780.00', segment: 'Repeat Buyer' },
          { id: '3', name: 'Elena Rodriguez', email: 'elena@example.com', orders: 3, spent: 'Rs. 210.00', segment: 'New' },
        ]}
        keyField="id"
      />
    </div>
  );
}
