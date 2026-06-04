'use client';

import { Button, SearchBar, StatusBadge, DataTable } from '@hotzy/ui';

export default function InventoryPage() {
  const columns = [
    { key: 'name', header: 'Product' },
    { key: 'sku', header: 'SKU' },
    { key: 'category', header: 'Category' },
    { key: 'price', header: 'Price' },
    { key: 'stock', header: 'Stock Level' },
    { key: 'status', header: 'Status' },
    { key: 'actions', header: 'Actions' },
  ];

  const data = [
    {
      id: '1',
      name: 'Snake Bite Hot Sauce',
      sku: 'HZ-SB-001',
      category: 'Hot Sauces',
      price: 'Rs. 1,850',
      stock: 'In Stock (200)',
      status: 'active' as const,
    },
    {
      id: '2',
      name: 'Scorpion Sting Hot Sauce',
      sku: 'HZ-SS-002',
      category: 'Hot Sauces',
      price: 'Rs. 1,850',
      stock: 'Low Stock (12)',
      status: 'active' as const,
    },
    {
      id: '3',
      name: 'Mango Tango Jam',
      sku: 'HZ-MT-006',
      category: 'Jams',
      price: 'Rs. 990',
      stock: 'Out of Stock',
      status: 'expired' as const,
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-headline-lg text-on-surface">Inventory</h1>
        <Button>Add New Product</Button>
      </div>

      <div className="mb-4">
        <SearchBar placeholder="Search inventory..." value="" onChange={() => {}} />
      </div>

      <DataTable
        columns={[
          ...columns.slice(0, -1),
          {
            key: 'status',
            header: 'Status',
            render: (item: any) => <StatusBadge status={item.status} />,
          },
          {
            key: 'actions',
            header: 'Actions',
            render: () => (
              <div className="flex gap-2">
                <button className="text-primary">
                  <span className="material-symbols-outlined">edit</span>
                </button>
                <button className="text-error">
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            ),
          },
        ]}
        data={data}
        keyField="id"
      />
    </div>
  );
}
