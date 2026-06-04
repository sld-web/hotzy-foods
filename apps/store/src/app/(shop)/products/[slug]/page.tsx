'use client';

import { Button, SpiceMeter, Badge, Accordion } from '@hotzy/ui';

const product = {
  name: 'Snake Bite Hot Sauce',
  price: 'Rs. 1,850',
  originalPrice: 'Rs. 2,200',
  description: 'A pineapple-based hot sauce with a perfect balance of sweet and heat.',
  heatLevel: 2 as const,
  badges: ['bestseller' as const, 'vegan' as const, 'gluten-free' as const, 'no-msg' as const],
  sku: 'HZ-SB-001',
  category: 'Hot Sauces',
};

export default function ProductDetailPage() {
  return (
    <div className="max-w-container mx-auto px-4 md:px-margin-desktop py-stack-lg">
      <a href="/products" className="text-label-md text-primary flex items-center gap-1 mb-6">
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        Back to Sauces
      </a>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Gallery */}
        <div className="aspect-square bg-surface-gray rounded-xl flex items-center justify-center">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant">image</span>
        </div>

        {/* Info */}
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {product.badges.map((badge) => (
              <Badge key={badge} variant={badge} />
            ))}
          </div>

          <h1 className="text-display-mobile md:text-display-lg text-on-surface">{product.name}</h1>
          <SpiceMeter level={product.heatLevel} />

          <div className="flex items-baseline gap-2">
            <span className="text-headline-lg text-primary">{product.price}</span>
            {product.originalPrice && (
              <span className="text-body-lg text-on-surface-variant line-through">{product.originalPrice}</span>
            )}
          </div>

          <p className="text-body-md text-on-surface-variant">{product.description}</p>

          <div className="flex items-center gap-4">
            <div className="flex items-center border border-outline-variant rounded-lg">
              <button className="px-3 py-2 text-on-surface-variant hover:text-on-surface">−</button>
              <span className="px-4 py-2 text-body-md text-on-surface border-x border-outline-variant">1</span>
              <button className="px-3 py-2 text-on-surface-variant hover:text-on-surface">+</button>
            </div>
            <Button size="lg">Add to Cart</Button>
          </div>

          <p className="text-label-sm text-on-surface-variant">SKU: {product.sku} | Category: {product.category}</p>

          <div className="pt-4">
            <Accordion title="Ingredients & Nutrition">
              <p>Serving size: 1 tsp (5ml). Calories: 5. Sodium: 85mg.</p>
              <p>Ingredients: Pineapple, Scotch Bonnet peppers, vinegar, garlic, salt, spices.</p>
            </Accordion>
            <Accordion title="Shipping & Returns">
              <p>Free shipping on orders over Rs. 5,000. Returns accepted within 14 days.</p>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}
