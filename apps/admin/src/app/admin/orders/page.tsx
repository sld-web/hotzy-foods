'use client';

import { StatusBadge, SearchBar, DataTable, Button } from '@hotzy/ui';

export default function OrdersPage() {
  const columns = [
    { key: 'orderNumber', header: 'Order' },
    { key: 'customer', header: 'Customer' },
    { key: 'date', header: 'Date' },
    { key: 'total', header: 'Total' },
    { key: 'status', header: 'Status' },
    { key: 'actions', header: 'Actions' },
  ];

  const data = [
    {
      id: '1',
      orderNumber: '#HZ-8892',
      customer: 'Sarah Jenkins',
      date: 'Oct 24, 2023',
      total: 'Rs. 3,150',
      status: 'completed' as const,
    },
    {
      id: '2',
      orderNumber: '#HZ-8891',
      customer: 'Michael Chang',
      date: 'Oct 23, 2023',
      total: 'Rs. 5,200',
      status: 'processing' as const,
    },
    {
      id: '3',
      orderNumber: '#HZ-8890',
      customer: 'Elena Rodriguez',
      date: 'Oct 22, 2023',
      total: 'Rs. 2,450',
      status: 'pending' as const,
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-headline-lg text-on-surface">Order Fulfillment</h1>
        <Button>Create New Order</Button>
      </div>

      <div className="flex gap-2 mb-4">
        {['All Orders', 'Pending', 'Processing', 'Shipped', 'Completed'].map((tab) => (
          <button
            key={tab}
            className="px-3 py-1.5 rounded-full text-label-sm bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            {tab}
          </button>
        ))}
      </div>

      <DataTable
        columns={[
          ...columns.slice(0, -1),
          {
            key: 'status',
            header: 'Status',
            render: (item: any) => <StatusBadge status={item.status} />,
          },
          {
            key: 'actions',
            header: 'Actions',
            render: () => (
              <div className="flex gap-2">
                <button className="text-primary text-label-sm font-semibold">Details</button>
                <button className="text-on-surface-variant text-label-sm">Print Label</button>
              </div>
            ),
          },
        ]}
        data={data}
        keyField="id"
      />
    </div>
  );
}
