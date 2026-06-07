'use client';

import { Suspense, useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { trpc } from '@/lib/trpc';
import { useCart } from '@/lib/cart-store';
import { formatPrice } from '@/lib/constants';
import Link from 'next/link';
import { Card, Badge, SpiceMeter, Button } from '@hotzy/ui';

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

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [page, setPage] = useState(1);
  const searchRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const addItem = useCart((s) => s.addItem);

  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || '');
  }, [searchParams.get('category')]);

  const setCategory = useCallback(
    (value: string) => {
      setSelectedCategory(value);
      setPage(1);
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set('category', value);
      else params.delete('category');
      router.replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname],
  );

  const { data: categories } = trpc.category.list.useQuery();
  const { data: productsData, isLoading } = trpc.product.list.useQuery({
    category: selectedCategory || undefined,
    search: debouncedSearch || undefined,
    page,
    limit: 12,
  });

  const filterOptions = useMemo(() => {
    const opts = [{ value: '', label: 'All Products' }];
    if (categories) {
      categories.forEach((cat: any) => opts.push({ value: cat.slug, label: cat.name }));
    }
    return opts;
  }, [categories]);

  const handleSearch = (value: string) => {
    setSearch(value);
    if (searchRef.current) clearTimeout(searchRef.current);
    searchRef.current = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1);
    }, 300);
  };

  return (
    <div className="max-w-container mx-auto px-4 md:px-margin-desktop py-stack-lg">
      <h1 className="text-headline-lg text-on-surface mb-2">Our Products</h1>
      <p className="text-body-md text-on-surface-variant mb-6">
        Explore bold tastes beyond the ordinary, one bottle at a time.
      </p>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative md:w-80">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search sauces, glazes..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-outline-variant bg-white text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setCategory(opt.value)}
              className={`px-3 py-1.5 rounded-full text-label-sm transition-colors ${
                selectedCategory === opt.value
                  ? 'bg-primary text-white'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-on-surface-variant">Loading...</div>
      ) : productsData && productsData.items.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {productsData.items.map((product: any) => (
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
                      <span className="hidden md:inline">Add to Cart</span>
                      <span className="material-symbols-outlined inline md:hidden text-[20px]">
                        shopping_cart
                      </span>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          {productsData.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg border border-outline-variant text-label-sm disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: productsData.totalPages }, (_, i) => i + 1).map((p: any) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1.5 rounded-lg text-label-sm ${
                    page === p ? 'bg-primary text-white' : 'border border-outline-variant'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(productsData.totalPages, p + 1))}
                disabled={page === productsData.totalPages}
                className="px-3 py-1.5 rounded-lg border border-outline-variant text-label-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 text-on-surface-variant">No products found.</div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-12 text-on-surface-variant">Loading products...</div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
