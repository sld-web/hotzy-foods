'use client';

import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { SearchBar } from '@hotzy/ui';

export default function CustomersPage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [segment, setSegment] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const limit = 15;

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, segment]);

  const { data, isLoading } = trpc.admin.customer.list.useQuery(
    {
      search: debouncedSearch || undefined,
      segment,
      page,
      limit,
    },
    { staleTime: 30_000 },
  );

  const formatCurrency = (value: unknown) => {
    if (value == null) return 'Rs. 0';
    return `Rs. ${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const segments = ['VIP - High Spender', 'Repeat Buyer', 'New', 'At Risk', 'Lost'];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-headline-lg text-on-surface">Customer Insights</h1>
        <div className="flex gap-2 flex-wrap">
          {segments.map((s) => (
            <button
              key={s}
              onClick={() => {
                setSegment(segment === s ? undefined : s);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-full text-label-sm transition-colors whitespace-nowrap ${
                segment === s
                  ? 'bg-primary text-white'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <SearchBar
        placeholder="Search by name or email..."
        value={search}
        onChange={(v) => setSearch(v)}
        className="mb-4"
      />

      <div className="bg-white rounded-xl border border-surface-container overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-gray border-b border-surface-container">
                <th className="text-left px-4 py-3 text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Name
                </th>
                <th className="text-left px-4 py-3 text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Email
                </th>
                <th className="text-left px-4 py-3 text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Phone
                </th>
                <th className="text-left px-4 py-3 text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Orders
                </th>
                <th className="text-left px-4 py-3 text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="text-left px-4 py-3 text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Segment
                </th>
                <th className="text-left px-4 py-3 text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Type
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
                    No customers found
                  </td>
                </tr>
              ) : (
                data.items.map((customer: any) => (
                  <tr key={customer.id} className="hover:bg-surface-container/20 transition-colors">
                    <td className="px-4 py-3 text-body-md text-on-surface font-medium">
                      {customer.name ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-body-md text-on-surface-variant">
                      {customer.email}
                    </td>
                    <td className="px-4 py-3 text-body-md text-on-surface-variant">
                      {customer.phone ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-body-md text-on-surface">
                      {customer.totalOrders}
                    </td>
                    <td className="px-4 py-3 text-body-md text-on-surface">
                      {formatCurrency(customer.totalSpent)}
                    </td>
                    <td className="px-4 py-3">
                      {customer.segment ? (
                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-label-sm bg-surface-container text-on-surface-variant">
                          {customer.segment}
                        </span>
                      ) : (
                        <span className="text-label-sm text-on-surface-variant">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-label-sm ${
                          customer.isGuest
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {customer.isGuest ? 'Guest' : 'Registered'}
                      </span>
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
