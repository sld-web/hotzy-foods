'use client';

import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { useCart } from '@/lib/cart-store';
import { CURRENCY, formatPrice } from '@/lib/constants';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button, SpiceMeter, Badge, Accordion } from '@hotzy/ui';

const heatLevelMap: Record<string, 1 | 2 | 3 | 4 | undefined> = {
  MILD: 1,
  MEDIUM: 2,
  HOT: 3,
  XTREME: 4,
};

function getBadges(product: { isBestseller: boolean; isNew: boolean; dietaryTags: string[] }) {
  const badges: Array<{ variant: 'bestseller' | 'new' | 'vegan' | 'gluten-free' | 'no-msg' }> = [];
  if (product.isBestseller) badges.push({ variant: 'bestseller' });
  if (product.isNew) badges.push({ variant: 'new' });
  if (product.dietaryTags?.includes('vegan')) badges.push({ variant: 'vegan' });
  if (product.dietaryTags?.includes('gluten-free')) badges.push({ variant: 'gluten-free' });
  if (product.dietaryTags?.includes('no-msg')) badges.push({ variant: 'no-msg' });
  return badges;
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [quantity, setQuantity] = useState(1);
  const addItem = useCart((s) => s.addItem);

  const { data: product, isLoading } = trpc.product.bySlug.useQuery({ slug });

  if (isLoading) {
    return (
      <div className="max-w-container mx-auto px-4 md:px-margin-desktop py-stack-lg text-center text-on-surface-variant">
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-container mx-auto px-4 md:px-margin-desktop py-stack-lg text-center text-on-surface-variant">
        Product not found.
      </div>
    );
  }

  const badges = getBadges(product);

  return (
    <div className="max-w-container mx-auto px-4 md:px-margin-desktop py-stack-lg">
      <Link
        href="/products"
        className="text-label-md text-primary flex items-center gap-1 mb-6 hover:underline"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        Back to Products
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-surface-gray rounded-xl flex items-center justify-center overflow-hidden">
            {product.images?.[0] ? (
              <img
                src={product.images[0].url}
                alt={product.images[0].alt || product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="material-symbols-outlined text-6xl text-on-surface-variant">
                image
              </span>
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex gap-4">
              {product.images.map((img: any) => (
                <div
                  key={img.id}
                  className="w-20 h-20 rounded-lg bg-surface-gray overflow-hidden border-2 border-transparent hover:border-primary transition-colors cursor-pointer"
                >
                  <img src={img.url} alt={img.alt || ''} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {badges.map((badge) => (
              <Badge key={badge.variant} variant={badge.variant} />
            ))}
          </div>

          <h1 className="text-display-mobile md:text-display-lg text-on-surface">{product.name}</h1>
          {product.heatLevel && <SpiceMeter level={heatLevelMap[product.heatLevel] || 1} />}

          <div className="flex items-baseline gap-2">
            <span className="text-headline-lg text-primary">
              {formatPrice(Number(product.price))}
            </span>
            {product.compareAtPrice && Number(product.compareAtPrice) > 0 && (
              <span className="text-body-lg text-on-surface-variant line-through">
                {formatPrice(Number(product.compareAtPrice))}
              </span>
            )}
          </div>

          <p className="text-body-md text-on-surface-variant">{product.description}</p>

          {/* Dietary tags */}
          {product.dietaryTags && product.dietaryTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.dietaryTags.map((tag: any) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-label-sm bg-fresh-mint/15 text-tertiary"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Quantity + Add to Cart */}
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-outline-variant rounded-lg">
              <button
                className="px-3 py-2 text-on-surface-variant hover:text-on-surface"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <span className="px-4 py-2 text-body-md text-on-surface border-x border-outline-variant min-w-[3rem] text-center">
                {quantity}
              </span>
              <button
                className="px-3 py-2 text-on-surface-variant hover:text-on-surface"
                onClick={() => setQuantity((q) => Math.min(99, q + 1))}
              >
                +
              </button>
            </div>
            <Button
              size="lg"
              onClick={() => {
                addItem(
                  {
                    productId: product.id,
                    name: product.name,
                    slug: product.slug,
                    price: Number(product.price),
                    image: product.images?.[0]?.url || '',
                    heatLevel: product.heatLevel,
                  },
                  quantity,
                );
                setQuantity(1);
              }}
            >
              Add to Cart
            </Button>
          </div>

          <p className="text-label-sm text-on-surface-variant">
            SKU: {product.sku} | Category: {product.category?.name || 'Uncategorized'}
          </p>

          <div className="pt-4">
            <Accordion title="Ingredients & Nutrition">
              <p>Serving size: 1 tsp (5ml). Calories: 5. Sodium: 85mg.</p>
              <p>Ingredients: Premium peppers, vinegar, garlic, salt, spices.</p>
            </Accordion>
            <Accordion title="Shipping & Returns">
              <p>Free shipping on orders over {CURRENCY} 5,000. Returns accepted within 14 days.</p>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}
