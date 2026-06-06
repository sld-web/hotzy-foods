'use client';

import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc';
import { useCustomerAuth } from '@/lib/customer-auth-store';
import { formatPrice } from '@/lib/constants';
import { StatusBadge, Spinner } from '@hotzy/ui';
import Link from 'next/link';
import { useEffect } from 'react';

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-LK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated } = useCustomerAuth();
  const { data: orders, isLoading } = trpc.customerOrder.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="max-w-container mx-auto px-4 md:px-margin-desktop py-stack-lg">
      <h1 className="text-headline-lg text-on-surface mb-6">My Orders</h1>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : orders && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block bg-white rounded-xl border border-surface-container p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-label-sm text-on-surface-variant">
                  {formatDate(order.createdAt)}
                </span>
                <StatusBadge status={order.status.toLowerCase() as any} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-body-md font-semibold text-on-surface">
                    {order.orderNumber}
                  </span>
                  <span className="text-body-md text-on-surface-variant ml-4">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <span className="text-headline-md text-primary">
                  {formatPrice(Number(order.total))}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">
            receipt_long
          </span>
          <p className="text-body-lg text-on-surface-variant mb-4">No orders yet</p>
          <Link
            href="/products"
            className="inline-flex items-center px-5 py-2.5 rounded-lg bg-primary text-white text-label-md font-semibold hover:bg-[#92001f] transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
}
