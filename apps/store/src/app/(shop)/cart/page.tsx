'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cart-store';
import { useCustomerAuth } from '@/lib/customer-auth-store';
import { trpc } from '@/lib/trpc';
import { formatPrice, FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from '@/lib/constants';
import { Button, Input } from '@hotzy/ui';
import Link from 'next/link';
import { useToast } from '@hotzy/ui';

export default function CartPage() {
  const { items, promoCode, updateQuantity, removeItem, clearCart, setPromoCode } = useCart();
  const { toast } = useToast();
  const { customer: authCustomer } = useCustomerAuth();
  const [promoInput, setPromoInput] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [lastOrder, setLastOrder] = useState<{ orderNumber: string; email: string } | null>(null);

  const [shippingName, setShippingName] = useState('');
  const [shippingPhone, setShippingPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingProvince, setShippingProvince] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [notes, setNotes] = useState('');

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const { data: promoResult } = trpc.promoValidate.useQuery(
    { code: promoCode, subtotal },
    { enabled: promoCode.length > 0 },
  );
  const discountAmount = promoResult?.valid ? promoResult.discountAmount : 0;

  const createOrder = trpc.order.create.useMutation({
    onSuccess: (order) => {
      setLastOrder({
        orderNumber: order.orderNumber,
        email: customerEmail || authCustomer?.email || '',
      });
      clearCart();
      setShowCheckout(false);
    },
    onError: (err) => {
      toast(err.message || 'Failed to place order', 'error');
    },
  });

  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal - discountAmount + shippingCost;

  const handleApplyPromo = () => {
    if (!promoInput.trim()) return;
    setPromoCode(promoInput.trim().toUpperCase());
    toast('Checking promo code...', 'success');
    setPromoInput('');
  };

  const handlePlaceOrder = () => {
    if (items.length === 0) return;
    if (!shippingName || !shippingAddress || !shippingCity) {
      toast('Please fill in all required shipping fields', 'error');
      return;
    }
    if (!authCustomer && !customerEmail) {
      toast('Please provide an email for order tracking', 'error');
      return;
    }

    createOrder.mutate({
      items: items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        unitPrice: i.price,
      })),
      shippingName,
      shippingPhone: shippingPhone || undefined,
      shippingAddress,
      shippingCity,
      shippingProvince: shippingProvince || undefined,
      promoCode: promoCode || undefined,
      notes: notes || undefined,
      customerEmail: customerEmail || undefined,
      customerName: customerName || undefined,
    });
  };

  if (items.length === 0 && !showCheckout) {
    if (lastOrder) {
      return (
        <div className="max-w-container mx-auto px-4 md:px-margin-desktop py-stack-lg text-center">
          <span className="material-symbols-outlined text-6xl text-primary mb-4">check_circle</span>
          <h1 className="text-headline-lg text-on-surface mb-2">Order Placed!</h1>
          <p className="text-body-lg text-on-surface-variant mb-2">
            Your order <span className="font-bold text-on-surface">#{lastOrder.orderNumber}</span>{' '}
            has been placed.
          </p>
          {lastOrder.email && (
            <p className="text-body-md text-on-surface-variant mb-6">
              A confirmation has been sent to {lastOrder.email}. Use this email and your order
              number to track your order.
            </p>
          )}
          <div className="flex gap-4 justify-center">
            <Link href="/products">
              <Button>Continue Shopping</Button>
            </Link>
            {authCustomer && (
              <Link href="/orders">
                <Button variant="outline">View My Orders</Button>
              </Link>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-container mx-auto px-4 md:px-margin-desktop py-stack-lg">
        <h1 className="text-headline-lg text-on-surface mb-6">Your Cart</h1>
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">
            shopping_cart
          </span>
          <p className="text-body-lg text-on-surface-variant mb-4">Your cart is empty</p>
          <Link href="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-container mx-auto px-4 md:px-margin-desktop py-stack-lg">
      <h1 className="text-headline-lg text-on-surface mb-6">Your Cart</h1>

      {!showCheckout ? (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="bg-white rounded-xl border border-surface-container p-4 flex gap-4"
              >
                <div className="w-20 h-20 bg-surface-gray rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-on-surface-variant">image</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <Link
                      href={`/products/${item.slug}`}
                      className="text-body-md font-semibold text-on-surface hover:text-primary"
                    >
                      {item.name}
                    </Link>
                    <span className="text-body-md text-on-surface">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-outline-variant rounded-lg">
                      <button
                        className="px-2 py-1 text-on-surface-variant"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span className="px-3 py-1 text-body-md text-on-surface border-x border-outline-variant min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        className="px-2 py-1 text-on-surface-variant"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="text-error text-label-sm"
                      onClick={() => removeItem(item.productId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl border border-surface-container p-6 h-fit space-y-4">
            <h2 className="text-headline-md text-on-surface">Order Summary</h2>
            <p className="text-label-sm text-on-surface-variant">
              Prices confirmed at checkout based on current product prices.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-body-md text-on-surface-variant">
                <span>Subtotal ({items.length} items)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-body-md text-on-surface-variant">
                <span>Shipping</span>
                <span>
                  {shippingCost === 0 ? (
                    <span className="text-tertiary">FREE</span>
                  ) : (
                    formatPrice(shippingCost)
                  )}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-body-md text-tertiary">
                  <span>Discount</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="border-t border-surface-container pt-2 flex justify-between text-headline-md text-on-surface">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder="Promo code"
                className="flex-1 px-3 py-2.5 rounded-lg border border-outline-variant bg-white text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
              <Button variant="outline" size="sm" onClick={handleApplyPromo}>
                Apply
              </Button>
            </div>

            {promoCode && <p className="text-label-sm text-tertiary">Promo {promoCode} applied!</p>}

            <Button className="w-full" size="lg" onClick={() => setShowCheckout(true)}>
              Proceed to Checkout
            </Button>

            <div className="flex gap-3 justify-center text-label-sm text-on-surface-variant">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">lock</span> Secure Payment
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">eco</span> Carbon Neutral
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Checkout Form */
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-surface-container p-6 space-y-4">
              <h2 className="text-headline-md text-on-surface">Shipping Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Full Name *"
                  id="shippingName"
                  value={shippingName}
                  onChange={(e) => setShippingName(e.target.value)}
                  placeholder="Your full name"
                />
                <Input
                  label="Phone"
                  id="shippingPhone"
                  value={shippingPhone}
                  onChange={(e) => setShippingPhone(e.target.value)}
                  placeholder="Phone number"
                />
              </div>
              <Input
                label="Address *"
                id="shippingAddress"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Street address"
              />
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="City *"
                  id="shippingCity"
                  value={shippingCity}
                  onChange={(e) => setShippingCity(e.target.value)}
                  placeholder="City"
                />
                <Input
                  label="Province"
                  id="shippingProvince"
                  value={shippingProvince}
                  onChange={(e) => setShippingProvince(e.target.value)}
                  placeholder="Province"
                />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-surface-container p-6 space-y-4">
              <h2 className="text-headline-md text-on-surface">Contact Information</h2>
              <Input
                label="Email (for order tracking)"
                id="customerEmail"
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="you@example.com"
              />
              <Input
                label="Name (optional)"
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Your name"
              />
              <div>
                <label className="block text-label-sm text-on-surface-variant mb-1">
                  Order Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Special instructions..."
                  className="w-full px-3 py-2.5 rounded-lg border border-outline-variant bg-white text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none h-20"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-surface-container p-6 h-fit space-y-4">
            <h2 className="text-headline-md text-on-surface">Order Summary</h2>
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex justify-between text-body-md text-on-surface-variant"
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-surface-container pt-2 space-y-2">
              <div className="flex justify-between text-body-md text-on-surface-variant">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-body-md text-on-surface-variant">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-body-md text-tertiary">
                  <span>Discount</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="border-t border-surface-container pt-2 flex justify-between text-headline-md text-on-surface">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <Button
              className="w-full"
              size="lg"
              loading={createOrder.isPending}
              onClick={handlePlaceOrder}
            >
              Place Order
            </Button>
            <Button variant="ghost" className="w-full" onClick={() => setShowCheckout(false)}>
              Back to Cart
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
