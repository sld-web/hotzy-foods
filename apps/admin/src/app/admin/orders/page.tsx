'use client';

import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { SearchBar } from '@hotzy/ui';

interface OrderItem {
  id: string;
  orderNumber: string;
  customer: { name: string | null } | null;
  shippingName: string;
  items: { id: string }[];
  createdAt: string;
  total: number;
  status: string;
}

const STATUS_TABS = [
  { value: undefined, label: 'All Orders' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
] as const;

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-gray-100 text-gray-800',
};

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 15;

  const { data, isLoading, refetch } = trpc.admin.order.list.useQuery(
    {
      status: statusFilter as any,
      search: search || undefined,
      page,
      limit,
    },
    { staleTime: 30_000 },
  );

  const updateStatus = trpc.admin.order.updateStatus.useMutation({
    onSuccess: () => refetch(),
  });

  const formatCurrency = (value: unknown) => {
    if (value == null) return 'Rs. 0';
    return `Rs. ${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-headline-lg text-on-surface">Order Fulfillment</h1>
      </div>

      <SearchBar
        placeholder="Search by order number or customer name..."
        value={search}
        onChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        className="mb-4"
      />

      <div className="flex gap-2 mb-4 flex-wrap">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.label}
            onClick={() => {
              setStatusFilter(tab.value);
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-full text-label-sm transition-colors ${
              statusFilter === tab.value
                ? 'bg-primary text-white'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-surface-container overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-gray border-b border-surface-container">
                <th className="text-left px-4 py-3 text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Order
                </th>
                <th className="text-left px-4 py-3 text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Customer
                </th>
                <th className="text-left px-4 py-3 text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Items
                </th>
                <th className="text-left px-4 py-3 text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Date
                </th>
                <th className="text-left px-4 py-3 text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Total
                </th>
                <th className="text-left px-4 py-3 text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right px-4 py-3 text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-on-surface-variant">
                    Loading...
                  </td>
                </tr>
              ) : !data || data.items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-on-surface-variant">
                    No orders found
                  </td>
                </tr>
              ) : (
                data.items.map((order: OrderItem) => (
                  <tr key={order.id} className="hover:bg-surface-container/20 transition-colors">
                    <td className="px-4 py-3 text-body-md text-on-surface font-medium">
                      {order.orderNumber}
                    </td>
                    <td className="px-4 py-3 text-body-md text-on-surface">
                      {order.customer?.name ?? order.shippingName}
                    </td>
                    <td className="px-4 py-3 text-body-md text-on-surface-variant">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </td>
                    <td className="px-4 py-3 text-body-md text-on-surface-variant">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-body-md text-on-surface">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-label-sm ${STATUS_STYLES[order.status] ?? 'bg-gray-100 text-gray-800'}`}
                      >
                        {order.status.toLowerCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {order.status === 'PENDING' && (
                        <button
                          onClick={() =>
                            updateStatus.mutate({ id: order.id, status: 'PROCESSING' })
                          }
                          className="text-label-sm text-primary font-semibold hover:underline mr-3"
                        >
                          Process
                        </button>
                      )}
                      {order.status === 'PROCESSING' && (
                        <button
                          onClick={() => updateStatus.mutate({ id: order.id, status: 'SHIPPED' })}
                          className="text-label-sm text-primary font-semibold hover:underline mr-3"
                        >
                          Ship
                        </button>
                      )}
                      {order.status === 'SHIPPED' && (
                        <button
                          onClick={() => updateStatus.mutate({ id: order.id, status: 'COMPLETED' })}
                          className="text-label-sm text-tertiary font-semibold hover:underline mr-3"
                        >
                          Complete
                        </button>
                      )}
                      {(order.status === 'PENDING' || order.status === 'PROCESSING') && (
                        <button
                          onClick={() => updateStatus.mutate({ id: order.id, status: 'CANCELLED' })}
                          className="text-label-sm text-error font-semibold hover:underline"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {data && data.totalPages > 1 && (
          <div className="px-4 py-4 border-t border-surface-container bg-surface-gray flex items-center justify-between">
            <span className="text-sm text-on-surface-variant">
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, data.total)} of{' '}
              {data.total} entries
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1 border border-surface-container rounded text-sm bg-white text-on-surface-variant disabled:opacity-50 hover:bg-surface-container transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                disabled={page >= data.totalPages}
                className="px-3 py-1 border border-surface-container rounded text-sm bg-white text-on-surface hover:bg-surface-container transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
