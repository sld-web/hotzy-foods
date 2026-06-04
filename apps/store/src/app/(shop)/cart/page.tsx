'use client';

import { Button } from '@hotzy/ui';

export default function CartPage() {
  return (
    <div className="max-w-container mx-auto px-4 md:px-margin-desktop py-stack-lg">
      <h1 className="text-headline-lg text-on-surface mb-6">Your Cart</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-surface-container p-4 flex gap-4">
            <div className="w-20 h-20 bg-surface-gray rounded-lg flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-on-surface-variant">image</span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <h3 className="text-body-md font-semibold text-on-surface">Snake Bite Hot Sauce</h3>
                <span className="text-body-md text-on-surface">Rs. 1,850</span>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center border border-outline-variant rounded-lg">
                  <button className="px-2 py-1 text-on-surface-variant">−</button>
                  <span className="px-3 py-1 text-body-md text-on-surface border-x border-outline-variant">1</span>
                  <button className="px-2 py-1 text-on-surface-variant">+</button>
                </div>
                <button className="text-error text-label-sm">Remove</button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-surface-container p-4 flex gap-4">
            <div className="w-20 h-20 bg-surface-gray rounded-lg flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-on-surface-variant">image</span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <h3 className="text-body-md font-semibold text-on-surface">Mango Tango Jam</h3>
                <span className="text-body-md text-on-surface">Rs. 990</span>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center border border-outline-variant rounded-lg">
                  <button className="px-2 py-1 text-on-surface-variant">−</button>
                  <span className="px-3 py-1 text-body-md text-on-surface border-x border-outline-variant">2</span>
                  <button className="px-2 py-1 text-on-surface-variant">+</button>
                </div>
                <button className="text-error text-label-sm">Remove</button>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl border border-surface-container p-6 h-fit space-y-4">
          <h2 className="text-headline-md text-on-surface">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-body-md text-on-surface-variant">
              <span>Subtotal</span>
              <span>Rs. 3,830</span>
            </div>
            <div className="flex justify-between text-body-md text-on-surface-variant">
              <span>Shipping</span>
              <span>Rs. 350</span>
            </div>
            <div className="flex justify-between text-body-md text-on-surface-variant">
              <span>Taxes</span>
              <span>Rs. 0</span>
            </div>
            <div className="border-t border-surface-container pt-2 flex justify-between text-headline-md text-on-surface">
              <span>Total</span>
              <span>Rs. 4,180</span>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Promo code"
              className="flex-1 px-3 py-2.5 rounded-lg border border-outline-variant bg-white text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
            <Button variant="outline" size="sm">Apply</Button>
          </div>

          <Button className="w-full" size="lg">
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
    </div>
  );
}
