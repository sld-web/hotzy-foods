'use client';

import { Button, Input, Select, Badge } from '@hotzy/ui';

export default function AddProductPage() {
  return (
    <div>
      <h1 className="text-headline-lg text-on-surface mb-6">Add New Product</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-surface-container p-6 space-y-4">
            <h2 className="text-headline-md text-on-surface">Basic Information</h2>
            <Input label="Product Name" id="name" placeholder="e.g. Snake Bite Hot Sauce" />
            <Input label="Slug" id="slug" placeholder="snake-bite-hot-sauce" />
            <Input label="SKU" id="sku" placeholder="HZ-SB-001" />
            <div>
              <label className="block text-label-sm text-on-surface-variant mb-1">Description</label>
              <textarea
                className="w-full px-3 py-2.5 rounded-lg border border-outline-variant bg-white text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none min-h-[120px]"
                placeholder="Product description..."
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-surface-container p-6 space-y-4">
            <h2 className="text-headline-md text-on-surface">Pricing & Inventory</h2>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Price (Rs.)" id="price" type="number" placeholder="1850" />
              <Input label="Compare at Price (Rs.)" id="compare-price" type="number" placeholder="2200" />
              <Input label="Cost Price (Rs.)" id="cost-price" type="number" placeholder="800" />
              <Input label="Stock Level" id="stock" type="number" placeholder="200" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-surface-container p-6 space-y-4">
            <h2 className="text-headline-md text-on-surface">Classification</h2>
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Category"
                id="category"
                options={[
                  { value: 'hot-sauces', label: 'Hot Sauces' },
                  { value: 'asian-sauces', label: 'Asian Inspired Sauces' },
                  { value: 'jams', label: 'Jams' },
                ]}
                placeholder="Select category"
              />
              <Select
                label="Heat Level"
                id="heat-level"
                options={[
                  { value: 'MILD', label: 'Mild' },
                  { value: 'MEDIUM', label: 'Medium' },
                  { value: 'HOT', label: 'Hot' },
                  { value: 'XTREME', label: 'Xtreme' },
                ]}
                placeholder="Select heat level"
              />
            </div>
            <div>
              <label className="block text-label-sm text-on-surface-variant mb-2">Dietary Tags</label>
              <div className="flex gap-2 flex-wrap">
                {['Vegan', 'Gluten Free', 'No MSG'].map((tag) => (
                  <label key={tag} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-outline-variant text-primary focus:ring-primary" />
                    <span className="text-body-md text-on-surface">{tag}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-surface-container p-6 space-y-4">
            <h2 className="text-headline-md text-on-surface">Media</h2>
            <div className="border-2 border-dashed border-outline-variant rounded-xl p-8 text-center">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">add_photo_alternate</span>
              <p className="text-label-sm text-on-surface-variant">Drop images here or click to upload</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-surface-container p-6 space-y-4">
            <h2 className="text-headline-md text-on-surface">Badges</h2>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="bestseller" />
              <Badge variant="new" />
              <Badge variant="signature" />
              <Badge variant="combo" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-surface-container p-6 space-y-4">
            <h2 className="text-headline-md text-on-surface">SEO</h2>
            <Input label="Meta Title" id="meta-title" />
            <div>
              <label className="block text-label-sm text-on-surface-variant mb-1">Meta Description</label>
              <textarea className="w-full px-3 py-2.5 rounded-lg border border-outline-variant bg-white text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none" rows={3} />
            </div>
          </div>

          <Button className="w-full">Save Product</Button>
        </div>
      </div>
    </div>
  );
}
