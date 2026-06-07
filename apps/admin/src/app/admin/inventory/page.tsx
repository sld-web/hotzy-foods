'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc';
import { Button, SearchBar, ConfirmDialog } from '@hotzy/ui';

const HEAT_ICONS = [
  'local_fire_department',
  'local_fire_department',
  'local_fire_department',
  'local_fire_department',
  'local_fire_department',
] as const;

function ProductImage({
  url,
  alt,
  name,
}: {
  url?: string | null;
  alt?: string | null;
  name: string;
}) {
  const [error, setError] = useState(false);
  if (!url || error) {
    return (
      <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
        <span className="material-symbols-outlined text-xl">image</span>
      </div>
    );
  }
  return (
    <img
      src={url}
      alt={alt ?? name}
      className="w-full h-full object-cover"
      onError={() => setError(true)}
    />
  );
}

function StockDot({ level }: { level: number }) {
  if (level <= 0) return <span className="w-2 h-2 rounded-full bg-error shrink-0" />;
  if (level <= 10) return <span className="w-2 h-2 rounded-full bg-golden-glaze shrink-0" />;
  return <span className="w-2 h-2 rounded-full bg-fresh-mint shrink-0" />;
}

function HeatScale({ shuMin, shuMax }: { shuMin?: number | null; shuMax?: number | null }) {
  const avg = ((shuMin ?? 0) + (shuMax ?? 0)) / 2;
  let filled = 1;
  if (avg >= 100000) filled = 5;
  else if (avg >= 50000) filled = 4;
  else if (avg >= 15000) filled = 3;
  else if (avg >= 2500) filled = 2;

  return (
    <div className="flex gap-0.5">
      {HEAT_ICONS.map((icon, i) => (
        <span
          key={i}
          className={`material-symbols-outlined text-sm ${i < filled ? 'text-chili-red' : 'text-surface-container-highest'}`}
        >
          {icon}
        </span>
      ))}
    </div>
  );
}

function CategoryBadge({ name }: { name: string }) {
  const colors: Record<string, string> = {
    'Hot Sauces': 'bg-red-100 text-red-800',
    'Asian Inspired Sauces': 'bg-yellow-100 text-yellow-800',
    Jams: 'bg-orange-100 text-orange-800',
    'Bundle Offers': 'bg-purple-100 text-purple-800',
    'Gift Packs': 'bg-green-100 text-green-800',
  };
  const colorClass = colors[name] || 'bg-surface-container text-on-surface-variant';
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}
    >
      {name}
    </span>
  );
}

export default function InventoryPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('newest');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const limit = 10;

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const { data, isLoading, error, refetch } = trpc.admin.product.list.useQuery(
    {
      search: debouncedSearch || undefined,
      sort: sort as any,
      page,
      limit,
    },
    { staleTime: 30_000 },
  );

  const deleteMutation = trpc.admin.product.delete.useMutation({
    onSuccess: () => {
      setDeleteId(null);
      refetch();
    },
  });

  const formatPrice = (price: unknown) => {
    if (price == null) return 'Rs. 0';
    return `Rs. ${Number(price).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-headline-lg text-on-surface">Inventory Management</h1>
          <p className="text-body-md text-on-surface-variant">
            Manage your hot sauce catalog, track stock levels, and update pricing.
          </p>
        </div>
        <Button onClick={() => router.push('/admin/products/new')} className="px-8 py-4">
          <span className="text-white">New Product</span>
        </Button>
      </div>

      <div className="mb-4 max-w-sm">
        <SearchBar placeholder="Search inventory..." value={search} onChange={setSearch} />
      </div>

      <div className="bg-white border border-surface-container rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-gray border-b border-surface-container">
                <th className="px-4 py-4 text-left text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Product
                </th>
                <th className="px-4 py-4 text-left text-label-sm text-on-surface-variant uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-4 py-4 text-left text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-4 text-left text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 py-4 text-left text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Stock Level
                </th>
                <th className="px-4 py-4 text-left text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Heat Scale
                </th>
                <th className="px-4 py-4 text-right text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-on-surface-variant">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      Loading products...
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <p className="text-error text-body-md">Failed to load products</p>
                    <button
                      onClick={() => refetch()}
                      className="mt-2 text-label-sm text-primary hover:underline"
                    >
                      Try again
                    </button>
                  </td>
                </tr>
              ) : !data || data.items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-on-surface-variant">
                    No products found
                  </td>
                </tr>
              ) : (
                data.items.map((product: any) => (
                  <tr key={product.id} className="hover:bg-surface-container/20 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-surface-container-highest overflow-hidden shrink-0">
                          <ProductImage
                            url={product.images[0]?.url}
                            alt={product.images[0]?.alt}
                            name={product.name}
                          />
                        </div>
                        <span className="text-body-md text-on-surface font-medium">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-body-md text-on-surface-variant">
                      {product.sku}
                    </td>
                    <td className="px-4 py-4">
                      <CategoryBadge name={product.category?.name ?? 'Uncategorized'} />
                    </td>
                    <td className="px-4 py-4 text-body-md text-on-surface">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <StockDot level={product.stockLevel} />
                        <span className={product.stockLevel <= 0 ? 'text-error font-medium' : ''}>
                          {product.stockLevel <= 0
                            ? 'Out of Stock'
                            : product.stockLevel <= (product.lowStockThreshold ?? 10)
                              ? `Low Stock (${product.stockLevel})`
                              : `In Stock (${product.stockLevel})`}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <HeatScale shuMin={product.shuMin} shuMax={product.shuMax} />
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={() => router.push(`/admin/products/${product.id}`)}
                        className="text-on-surface-variant hover:text-primary p-2 rounded-full hover:bg-surface-container transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                      <button
                        onClick={() => setDeleteId(product.id)}
                        className="text-on-surface-variant hover:text-error p-2 rounded-full hover:bg-error-container transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {data && data.totalPages > 1 && (
          <div className="px-4 py-4 border-t border-surface-container bg-surface-gray flex items-center justify-between">
            <span className="text-sm text-on-surface-variant">
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, data.total)} of{' '}
              {data.total} entries
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1 border border-surface-container rounded text-sm bg-white text-on-surface-variant disabled:opacity-50 hover:bg-surface-container transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                disabled={page >= data.totalPages}
                className="px-3 py-1 border border-surface-container rounded text-sm bg-white text-on-surface hover:bg-surface-container transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate({ id: deleteId })}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
