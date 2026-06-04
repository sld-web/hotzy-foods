import { SITE_NAME, SITE_TAGLINE } from '@/lib/constants';

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary/40 z-10" />
        <div className="relative z-20 text-center text-white px-4 max-w-3xl mx-auto">
          <p className="text-label-sm uppercase tracking-widest mb-4">New Arrival</p>
          <h1 className="text-display-mobile md:text-display-lg mb-4">{SITE_TAGLINE}</h1>
          <p className="text-body-lg mb-8 text-white/80">
            Sri Lanka most flavorful hot sauce brand. Crafted with premium Scotch Bonnet peppers.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/products"
              className="inline-flex items-center px-7 py-3.5 rounded-lg bg-white text-primary text-label-md font-semibold hover:bg-gray-100 transition-colors"
            >
              Order Now
            </a>
            <a
              href="/products"
              className="inline-flex items-center px-7 py-3.5 rounded-lg border-2 border-white text-white text-label-md font-semibold hover:bg-white/10 transition-colors"
            >
              View Menu
            </a>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="max-w-container mx-auto px-4 md:px-margin-desktop py-stack-lg">
        <h2 className="text-headline-lg text-on-surface mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Hot Sauces', icon: 'local_fire_department', slug: 'hot-sauces' },
            { name: 'Asian Sauces', icon: 'ramen_dining', slug: 'asian-inspired-sauces' },
            { name: 'Jams', icon: 'breakfast_dining', slug: 'jams' },
            { name: 'Bundle Offers', icon: 'inventory_2', slug: 'bundle-offers' },
          ].map((cat) => (
            <a
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl border border-surface-container hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <span className="material-symbols-outlined text-4xl text-primary">{cat.icon}</span>
              <span className="text-label-md font-semibold text-on-surface">{cat.name}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Hot Deals Bento Grid — placeholder */}
      <section className="bg-surface-gray py-stack-lg">
        <div className="max-w-container mx-auto px-4 md:px-margin-desktop">
          <h2 className="text-headline-lg text-on-surface mb-6">Hot Deals</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2 bg-white rounded-xl border border-surface-container p-6 flex items-center justify-center h-48 text-on-surface-variant">
              Deal banners coming soon
            </div>
            <div className="bg-white rounded-xl border border-surface-container p-6 flex items-center justify-center h-48 text-on-surface-variant">
              Combo offer coming soon
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products — placeholder */}
      <section className="max-w-container mx-auto px-4 md:px-margin-desktop py-stack-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-headline-lg text-on-surface">Featured Products</h2>
          <a href="/products" className="text-label-md text-primary font-semibold hover:underline">
            View All →
          </a>
        </div>
        <div className="text-center py-12 text-on-surface-variant">
          Product grid will render here from tRPC
        </div>
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
                <span className="material-symbols-outlined text-3xl text-primary mb-2">{item.icon}</span>
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
