'use client';

import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc';
import { useCustomerAuth } from '@/lib/customer-auth-store';
import { CURRENCY } from '@/lib/constants';
import { Spinner, StatusBadge } from '@hotzy/ui';
import Link from 'next/link';
import { useEffect } from 'react';

function formatPrice(price: number) {
  return `${CURRENCY} ${price.toLocaleString('en-LK')}`;
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-LK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function AccountDashboard() {
  const router = useRouter();
  const { isAuthenticated, customer, logout } = useCustomerAuth();
  const { data: me } = trpc.customerAuth.me.useQuery(undefined, { enabled: isAuthenticated });
  const { data: orders } = trpc.customerOrder.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const recentOrders = orders?.slice(0, 5) || [];

  return (
    <div className="max-w-container mx-auto px-4 md:px-margin-desktop py-stack-lg">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-headline-lg text-on-surface">My Account</h1>
          <p className="text-body-md text-on-surface-variant">
            Welcome back, {customer?.name || 'Valued Customer'}
          </p>
        </div>
        <button
          onClick={() => {
            logout();
            router.push('/');
          }}
          className="text-label-sm text-error hover:underline"
        >
          Sign Out
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-xl border border-surface-container p-6">
          <span className="material-symbols-outlined text-3xl text-primary mb-2">person</span>
          <p className="text-body-md font-semibold text-on-surface">{customer?.name || 'N/A'}</p>
          <p className="text-label-sm text-on-surface-variant mb-4">{customer?.email}</p>
          <Link href="/account/profile" className="text-label-sm text-primary hover:underline">
            Edit Profile
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-surface-container p-6">
          <span className="material-symbols-outlined text-3xl text-primary mb-2">
            local_shipping
          </span>
          <p className="text-display-mobile font-bold text-primary">{me?.totalOrders || 0}</p>
          <p className="text-label-sm text-on-surface-variant">Total Orders</p>
        </div>

        <div className="bg-white rounded-xl border border-surface-container p-6">
          <span className="material-symbols-outlined text-3xl text-primary mb-2">payments</span>
          <p className="text-display-mobile font-bold text-primary">
            {formatPrice(Number(me?.totalSpent || 0))}
          </p>
          <p className="text-label-sm text-on-surface-variant">Total Spent</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-surface-container p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-headline-md text-on-surface">Quick Links</h2>
          </div>
          <div className="space-y-3">
            <Link
              href="/orders"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-gray transition-colors"
            >
              <span className="material-symbols-outlined text-on-surface-variant">
                receipt_long
              </span>
              <span className="text-body-md text-on-surface">Order History</span>
              <span className="material-symbols-outlined ml-auto text-on-surface-variant">
                chevron_right
              </span>
            </Link>
            <Link
              href="/account/profile"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-gray transition-colors"
            >
              <span className="material-symbols-outlined text-on-surface-variant">settings</span>
              <span className="text-body-md text-on-surface">Profile Settings</span>
              <span className="material-symbols-outlined ml-auto text-on-surface-variant">
                chevron_right
              </span>
            </Link>
            <Link
              href="/account/addresses"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-gray transition-colors"
            >
              <span className="material-symbols-outlined text-on-surface-variant">map</span>
              <span className="text-body-md text-on-surface">Saved Addresses</span>
              <span className="material-symbols-outlined ml-auto text-on-surface-variant">
                chevron_right
              </span>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-surface-container p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-headline-md text-on-surface">Recent Orders</h2>
            <Link href="/orders" className="text-label-sm text-primary hover:underline">
              View All
            </Link>
          </div>
          {recentOrders.length > 0 ? (
            <div className="space-y-3">
              {recentOrders.map((order: any) => (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-gray transition-colors"
                >
                  <div>
                    <p className="text-body-md font-semibold text-on-surface">
                      {order.orderNumber}
                    </p>
                    <p className="text-label-sm text-on-surface-variant">
                      {formatDate(order.createdAt)} &middot; {order.items.length} item
                      {order.items.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-body-md text-primary">{formatPrice(Number(order.total))}</p>
                    <StatusBadge status={order.status.toLowerCase() as any} />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-body-md text-on-surface-variant mb-3">No orders yet</p>
              <Link
                href="/products"
                className="inline-flex items-center px-4 py-2 rounded-lg bg-primary text-white text-label-sm font-semibold hover:bg-[#92001f] transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
