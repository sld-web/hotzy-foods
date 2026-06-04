'use client';

import { FilterChips, SearchBar, SpiceMeter, Badge, Card, Button } from '@hotzy/ui';

const filterOptions = [
  { value: '', label: 'All Products' },
  { value: 'hot-sauces', label: 'Hot Sauces' },
  { value: 'asian-inspired-sauces', label: 'Asian Sauces' },
  { value: 'jams', label: 'Jams' },
  { value: 'bundle-offers', label: 'Bundle Offers' },
];

const products = [
  {
    id: '1',
    name: 'Snake Bite Hot Sauce',
    slug: 'snake-bite-hot-sauce',
    price: 'Rs. 1,850',
    heatLevel: 2 as const,
    badges: ['bestseller' as const],
    image: '/images/products/snake-bite.jpg',
  },
  {
    id: '2',
    name: 'Scorpion Sting Hot Sauce',
    slug: 'scorpion-sting-hot-sauce',
    price: 'Rs. 1,850',
    heatLevel: 1 as const,
    badges: [],
    image: '/images/products/scorpion-sting.jpg',
  },
  {
    id: '3',
    name: "Dragon's Fury Hot Sauce",
    slug: 'dragons-fury-hot-sauce',
    price: 'Rs. 1,950',
    heatLevel: 3 as const,
    badges: ['new' as const],
    image: '/images/products/dragons-fury.jpg',
  },
  {
    id: '4',
    name: 'Mango Tango Jam',
    slug: 'mango-tango-jam',
    price: 'Rs. 990',
    heatLevel: null,
    badges: ['bestseller' as const],
    image: '/images/products/mango-tango.jpg',
  },
];

export default function ProductsPage() {
  return (
    <div className="max-w-container mx-auto px-4 md:px-margin-desktop py-stack-lg">
      <h1 className="text-headline-lg text-on-surface mb-2">Our Products</h1>
      <p className="text-body-md text-on-surface-variant mb-6">
        Explore bold tastes beyond the ordinary, one bottle at a time.
      </p>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <SearchBar placeholder="Search sauces, glazes..." value="" onChange={() => {}} className="md:w-80" />
        <FilterChips options={filterOptions} selected="" onChange={() => {}} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <Card key={product.id} hover className="overflow-hidden">
            <div className="aspect-square bg-surface-gray flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant">image</span>
            </div>
            <div className="p-4 space-y-2">
              <div className="flex gap-1 flex-wrap">
                {product.badges.map((badge) => (
                  <Badge key={badge} variant={badge} />
                ))}
              </div>
              <h3 className="text-body-md font-semibold text-on-surface">{product.name}</h3>
              {product.heatLevel && <SpiceMeter level={product.heatLevel} />}
              <div className="flex items-center justify-between pt-2">
                <span className="text-headline-md text-primary">{product.price}</span>
                <Button size="sm">Add to Cart</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
