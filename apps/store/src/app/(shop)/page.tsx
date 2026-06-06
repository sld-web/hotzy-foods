'use client';

import { trpc } from '@/lib/trpc';
import { useCart } from '@/lib/cart-store';
import { SITE_TAGLINE, formatPrice } from '@/lib/constants';
import Link from 'next/link';
import { Card, Badge, SpiceMeter, Button } from '@hotzy/ui';

function getBadges(product: {
  isBestseller: boolean;
  isNew: boolean;
  dietaryTags: string[];
  heatLevel: string | null;
}) {
  const badges: Array<{
    variant: 'bestseller' | 'new' | 'vegan' | 'gluten-free' | 'no-msg';
    label: string;
  }> = [];
  if (product.isBestseller) badges.push({ variant: 'bestseller', label: 'Bestseller' });
  if (product.isNew) badges.push({ variant: 'new', label: 'New' });
  if (product.dietaryTags?.includes('vegan')) badges.push({ variant: 'vegan', label: 'Vegan' });
  if (product.dietaryTags?.includes('gluten-free'))
    badges.push({ variant: 'gluten-free', label: 'Gluten Free' });
  if (product.dietaryTags?.includes('no-msg')) badges.push({ variant: 'no-msg', label: 'No MSG' });
  return badges;
}

const heatLevelMap: Record<string, 1 | 2 | 3 | 4 | undefined> = {
  MILD: 1,
  MEDIUM: 2,
  HOT: 3,
  XTREME: 4,
};

export default function HomePage() {
  const { data: featured, isLoading: featuredLoading } = trpc.product.featured.useQuery();
  const { data: categories } = trpc.category.list.useQuery();
  const { data: campaigns } = trpc.campaign.active.useQuery();
  const { data: settings } = trpc.settings.get.useQuery();
  const addItem = useCart((s) => s.addItem);

  const dealCampaign = campaigns?.find((c: any) => c.placement === 'deals');

  return (
    <div>
      {/* Hero Section */}
      <section className="relative w-full h-[80vh] min-h-[500px] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${settings?.heroImageUrl || '/heros/h1.webp'})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10" />
        <div className="relative z-20 text-white px-4 md:px-margin-desktop max-w-2xl">
          {settings?.heroTitle && (
            <span className="inline-block px-3 py-1 mb-4 rounded-full bg-primary text-white text-label-sm uppercase tracking-wider">
              {settings.heroTitle}
            </span>
          )}
          <h1 className="text-display-mobile md:text-display-lg mb-4 leading-tight">
            {settings?.heroDescription || settings?.tagline || SITE_TAGLINE}
          </h1>
          <p className="text-body-lg mb-8 text-white/80 max-w-xl">
            {settings?.heroDescription
              ? 'Experience the heat. Discover our handcrafted sauces and jams made with premium ingredients.'
              : 'Sri Lanka most flavorful hot sauce brand. Crafted with premium Scotch Bonnet peppers.'}
          </p>
          <div className="flex gap-4">
            <Link
              href={settings?.heroCtaUrl || '/products'}
              className="inline-flex items-center px-7 py-3.5 rounded-lg bg-primary text-white text-label-md font-semibold hover:bg-[#92001f] transition-colors shadow-md"
            >
              {settings?.heroCtaText || 'Shop Now'}
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center px-7 py-3.5 rounded-lg border border-white/30 text-white text-label-md font-semibold hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              View Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      {categories && categories.length > 0 && (
        <section className="max-w-container mx-auto px-4 md:px-margin-desktop py-stack-lg">
          <h2 className="text-headline-lg text-on-surface mb-6">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat: any) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl border border-surface-container hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <span className="material-symbols-outlined text-4xl text-primary">
                  {cat.icon || 'category'}
                </span>
                <span className="text-label-md font-semibold text-on-surface">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Hot Deals */}
      {dealCampaign && (
        <section className="bg-surface-gray py-stack-lg">
          <div className="max-w-container mx-auto px-4 md:px-margin-desktop">
            <h2 className="text-headline-lg text-on-surface mb-6">{dealCampaign.title}</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div
                className="md:col-span-2 bg-white rounded-xl border border-surface-container p-6 flex items-end h-48 bg-cover bg-center relative overflow-hidden"
                style={
                  dealCampaign.imageUrl
                    ? { backgroundImage: `url(${dealCampaign.imageUrl})` }
                    : undefined
                }
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="relative z-10 text-white">
                  <h3 className="text-headline-md mb-1">{dealCampaign.title}</h3>
                  {dealCampaign.description && (
                    <p className="text-body-md text-white/80">{dealCampaign.description}</p>
                  )}
                </div>
              </div>
              <div className="bg-white rounded-xl border border-surface-container p-6 flex items-center justify-center h-48 text-on-surface-variant">
                {dealCampaign.linkUrl ? (
                  <Link
                    href={dealCampaign.linkUrl}
                    className="text-primary font-semibold hover:underline"
                  >
                    View Offer →
                  </Link>
                ) : (
                  'Limited time offer'
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="max-w-container mx-auto px-4 md:px-margin-desktop py-stack-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-headline-lg text-on-surface">Featured Products</h2>
          <Link
            href="/products"
            className="text-label-md text-primary font-semibold hover:underline"
          >
            View All →
          </Link>
        </div>
        {featuredLoading ? (
          <div className="text-center py-12 text-on-surface-variant">Loading...</div>
        ) : featured && featured.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map((product: any) => (
              <Card key={product.id} hover className="overflow-hidden">
                <Link href={`/products/${product.slug}`}>
                  <div className="aspect-square bg-surface-gray flex items-center justify-center overflow-hidden">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0].url}
                        alt={product.images[0].alt || product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <span className="material-symbols-outlined text-4xl text-on-surface-variant">
                        image
                      </span>
                    )}
                  </div>
                </Link>
                <div className="p-4 space-y-2">
                  <div className="flex gap-1 flex-wrap">
                    {getBadges(product).map((badge) => (
                      <Badge key={badge.variant} variant={badge.variant} />
                    ))}
                  </div>
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="text-body-md font-semibold text-on-surface hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  {product.heatLevel && <SpiceMeter level={heatLevelMap[product.heatLevel] || 1} />}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-headline-md text-primary">
                      {formatPrice(Number(product.price))}
                    </span>
                    <Button
                      size="sm"
                      onClick={() =>
                        addItem({
                          productId: product.id,
                          name: product.name,
                          slug: product.slug,
                          price: Number(product.price),
                          image: product.images?.[0]?.url || '',
                          heatLevel: product.heatLevel,
                        })
                      }
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-on-surface-variant">No featured products yet.</div>
        )}
      </section>

      {/* Values Section */}
      <section className="bg-white py-stack-lg border-t border-surface-container">
        <div className="max-w-container mx-auto px-4 md:px-margin-desktop">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { icon: 'eco', label: 'No Artificial Flavors or Colors' },
              { icon: 'spa', label: 'MSG-Free, Naturally Delicious' },
              { icon: 'grass', label: 'Plant-Based Goodness' },
              { icon: 'verified', label: 'Premium Quality Guaranteed' },
              { icon: 'visibility', label: 'Transparency You Can Trust' },
              { icon: 'restaurant', label: 'Crafted with Authentic Recipes' },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <span className="material-symbols-outlined text-3xl text-primary mb-2">
                  {item.icon}
                </span>
                <p className="text-label-sm text-on-surface-variant">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards */}
      <section className="bg-surface-gray py-stack-lg">
        <div className="max-w-container mx-auto px-4 md:px-margin-desktop text-center">
          <p className="text-body-md text-on-surface-variant">
            Best National Industry Brand 2024 — Small Scale, Food & Beverage Sector
          </p>
          <p className="text-body-md text-on-surface-variant mt-2">
            Bronze Award — Small Scale Category, NEDA 2024
          </p>
        </div>
      </section>
    </div>
  );
}
