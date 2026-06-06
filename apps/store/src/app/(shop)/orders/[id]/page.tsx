'use client';

import { useParams, useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc';
import { useCustomerAuth } from '@/lib/customer-auth-store';
import { CURRENCY } from '@/lib/constants';
import { StatusBadge, Spinner } from '@hotzy/ui';
import Link from 'next/link';
import { useEffect } from 'react';

function formatPrice(price: number) {
  return `${CURRENCY} ${price.toLocaleString('en-LK')}`;
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-LK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useCustomerAuth();
  const { data: order, isLoading } = trpc.customerOrder.byId.useQuery(
    { id: params.id as string },
    { enabled: isAuthenticated },
  );

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-container mx-auto px-4 md:px-margin-desktop py-stack-lg text-center text-on-surface-variant">
        Order not found.
      </div>
    );
  }

  return (
    <div className="max-w-container mx-auto px-4 md:px-margin-desktop py-stack-lg">
      <Link
        href="/orders"
        className="text-label-md text-primary flex items-center gap-1 mb-6 hover:underline"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        Back to Orders
      </Link>

      <div className="bg-white rounded-xl border border-surface-container p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-surface-container">
          <div>
            <h1 className="text-headline-lg text-on-surface">Order {order.orderNumber}</h1>
            <p className="text-label-sm text-on-surface-variant">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <StatusBadge status={order.status.toLowerCase() as any} />
        </div>

        {/* Items */}
        <div>
          <h2 className="text-headline-md text-on-surface mb-4">Items</h2>
          <div className="space-y-3">
            {order.items.map((item: any) => (
              <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg bg-surface-gray">
                <div className="w-16 h-16 rounded-lg bg-surface-container flex items-center justify-center overflow-hidden shrink-0">
                  {item.product.images?.[0] ? (
                    <img
                      src={item.product.images[0].url}
                      alt={item.product.images[0].alt || item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-on-surface-variant">image</span>
                  )}
                </div>
                <div className="flex-1">
                  <Link
                    href={`/products/${item.product.slug}`}
                    className="text-body-md font-semibold text-on-surface hover:text-primary"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-label-sm text-on-surface-variant">
                    Qty: {item.quantity} × {formatPrice(Number(item.unitPrice))}
                  </p>
                </div>
                <span className="text-body-md text-on-surface font-semibold">
                  {formatPrice(Number(item.subtotal))}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="border-t border-surface-container pt-4 space-y-2">
          <div className="flex justify-between text-body-md text-on-surface-variant">
            <span>Subtotal</span>
            <span>{formatPrice(Number(order.subtotal))}</span>
          </div>
          <div className="flex justify-between text-body-md text-on-surface-variant">
            <span>Shipping</span>
            <span>
              {Number(order.shippingCost) === 0 ? 'FREE' : formatPrice(Number(order.shippingCost))}
            </span>
          </div>
          {Number(order.discountAmount) > 0 && (
            <div className="flex justify-between text-body-md text-tertiary">
              <span>Discount</span>
              <span>-{formatPrice(Number(order.discountAmount))}</span>
            </div>
          )}
          <div className="border-t border-surface-container pt-2 flex justify-between text-headline-md text-on-surface">
            <span>Total</span>
            <span>{formatPrice(Number(order.total))}</span>
          </div>
        </div>

        {/* Shipping */}
        <div className="border-t border-surface-container pt-4">
          <h2 className="text-headline-md text-on-surface mb-2">Shipping Address</h2>
          <p className="text-body-md text-on-surface-variant">{order.shippingName}</p>
          {order.shippingPhone && (
            <p className="text-body-md text-on-surface-variant">{order.shippingPhone}</p>
          )}
          <p className="text-body-md text-on-surface-variant">{order.shippingAddress}</p>
          <p className="text-body-md text-on-surface-variant">
            {order.shippingCity}
            {order.shippingProvince ? `, ${order.shippingProvince}` : ''}
          </p>
        </div>
      </div>
    </div>
  );
}
