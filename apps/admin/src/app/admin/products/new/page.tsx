'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { trpc } from '@/lib/trpc';
import { Button, Input, Select } from '@hotzy/ui';
import { createProductSchema } from '@hotzy/validators';
import type { CreateProductInput } from '@hotzy/validators';

const HEAT_LEVELS = [
  { value: 'MILD', label: 'Mild', fires: 1 },
  { value: 'MEDIUM', label: 'Medium', fires: 2 },
  { value: 'HOT', label: 'Hot', fires: 3 },
  { value: 'XTREME', label: 'Xtreme', fires: 4 },
] as const;

const DIETARY_OPTIONS = ['Vegan', 'Gluten Free', 'No MSG', 'Organic', 'Keto', 'Sugar Free'];

export default function AddProductPage() {
  const router = useRouter();
  const [selectedHeat, setSelectedHeat] = useState(0);
  const [dietaryTags, setDietaryTags] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState('');

  const { data: categories } = trpc.admin.category.list.useQuery(undefined, { staleTime: 60_000 });
  const createMutation = trpc.admin.product.create.useMutation({
    onSuccess: () => {
      router.push('/admin/inventory');
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      isActive: true,
      isFeatured: false,
      isBestseller: false,
      isNew: false,
      stockLevel: 0,
      lowStockThreshold: 10,
      dietaryTags: [],
      images: [],
    },
  });

  const onSubmit = (data: CreateProductInput) => {
    createMutation.mutate(data);
  };

  const toggleDietaryTag = (tag: string) => {
    const next = dietaryTags.includes(tag)
      ? dietaryTags.filter((t) => t !== tag)
      : [...dietaryTags, tag];
    setDietaryTags(next);
    setValue('dietaryTags', next);
  };

  const addImageUrl = () => {
    if (imageInput && !imageUrls.includes(imageInput)) {
      const urls = [...imageUrls, imageInput];
      setImageUrls(urls);
      setValue(
        'images',
        urls.map((url, i) => ({ url, sortOrder: i })),
      );
      setImageInput('');
    }
  };

  const removeImage = (idx: number) => {
    const urls = imageUrls.filter((_, i) => i !== idx);
    setImageUrls(urls);
    setValue(
      'images',
      urls.map((url, i) => ({ url, sortOrder: i })),
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-label-sm text-on-surface-variant mb-1">
            Inventory &gt; Add New Product
          </p>
          <h1 className="text-headline-lg text-on-surface">Create New Product</h1>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => router.push('/admin/inventory')}>
            Discard changes
          </Button>
          <Button onClick={handleSubmit(onSubmit)} loading={createMutation.isPending}>
            Save Product
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-surface-container p-6 space-y-4">
              <h2 className="text-headline-md text-on-surface">Basic Information</h2>
              <Input
                label="Product Name"
                id="name"
                placeholder="e.g. Snake Bite Hot Sauce"
                error={errors.name?.message}
                {...register('name')}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Slug"
                  id="slug"
                  placeholder="snake-bite-hot-sauce"
                  error={errors.slug?.message}
                  {...register('slug')}
                />
                <Input
                  label="SKU"
                  id="sku"
                  placeholder="HZ-SB-001"
                  error={errors.sku?.message}
                  {...register('sku')}
                />
              </div>
              <div>
                <label className="block text-label-sm text-on-surface-variant mb-1">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  className="w-full px-3 py-2.5 rounded-lg border border-outline-variant bg-white text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none min-h-[120px]"
                  placeholder="Product description..."
                />
                {errors.description && (
                  <p className="text-label-sm text-error mt-1">{errors.description.message}</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-surface-container p-6 space-y-4">
              <h2 className="text-headline-md text-on-surface">Pricing & Inventory</h2>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Price (Rs.)"
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="1850"
                  error={errors.price?.message}
                  {...register('price', { valueAsNumber: true })}
                />
                <Input
                  label="Compare at Price (Rs.)"
                  id="compareAtPrice"
                  type="number"
                  step="0.01"
                  placeholder="2200"
                  {...register('compareAtPrice', { valueAsNumber: true })}
                />
                <Input
                  label="Cost Price (Rs.)"
                  id="costPrice"
                  type="number"
                  step="0.01"
                  placeholder="800"
                  {...register('costPrice', { valueAsNumber: true })}
                />
                <Input
                  label="Stock Level"
                  id="stockLevel"
                  type="number"
                  placeholder="200"
                  {...register('stockLevel', { valueAsNumber: true })}
                />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-surface-container p-6 space-y-4">
              <h2 className="text-headline-md text-on-surface">Classification</h2>
              <Select
                label="Category"
                id="categoryId"
                error={errors.categoryId?.message}
                placeholder="Select category"
                {...register('categoryId')}
                options={categories?.map((c) => ({ value: c.id, label: c.name })) ?? []}
              />

              <div>
                <label className="block text-label-sm text-on-surface-variant mb-2">
                  Heat Scale
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4].map((level) => {
                    const heat = HEAT_LEVELS[level - 1];
                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() => {
                          setSelectedHeat(level);
                          setValue('heatLevel', heat.value as any);
                        }}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border transition-colors ${
                          selectedHeat === level
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-surface-container text-on-surface-variant hover:border-primary/50'
                        }`}
                      >
                        <span className="material-symbols-outlined text-chili-red text-sm">
                          local_fire_department
                        </span>
                        <span className="text-label-sm">{heat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-label-sm text-on-surface-variant mb-2">
                  SHU Range
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Min SHU"
                    id="shuMin"
                    type="number"
                    placeholder="0"
                    {...register('shuMin', { valueAsNumber: true })}
                  />
                  <Input
                    label="Max SHU"
                    id="shuMax"
                    type="number"
                    placeholder="50000"
                    {...register('shuMax', { valueAsNumber: true })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-label-sm text-on-surface-variant mb-2">
                  Dietary Tags
                </label>
                <div className="flex gap-2 flex-wrap">
                  {DIETARY_OPTIONS.map((tag) => (
                    <label key={tag} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={dietaryTags.includes(tag)}
                        onChange={() => toggleDietaryTag(tag)}
                        className="rounded border-outline-variant text-primary focus:ring-primary"
                      />
                      <span className="text-body-md text-on-surface">{tag}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-label-sm text-on-surface-variant mb-2">Badges</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('isFeatured')}
                      className="rounded border-outline-variant text-primary focus:ring-primary"
                    />
                    <span className="text-body-md text-on-surface">Featured</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('isBestseller')}
                      className="rounded border-outline-variant text-primary focus:ring-primary"
                    />
                    <span className="text-body-md text-on-surface">Bestseller</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('isNew')}
                      className="rounded border-outline-variant text-primary focus:ring-primary"
                    />
                    <span className="text-body-md text-on-surface">New</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-surface-container p-6 space-y-4">
              <h2 className="text-headline-md text-on-surface">Product Media</h2>

              {/* Image URL input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={imageInput}
                  onChange={(e) => setImageInput(e.target.value)}
                  placeholder="Paste image URL..."
                  className="flex-1 px-3 py-2 rounded-lg border border-outline-variant bg-white text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
                <Button type="button" variant="outline" size="sm" onClick={addImageUrl}>
                  Add
                </Button>
              </div>

              {/* Image previews */}
              {imageUrls.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {imageUrls.map((url, i) => (
                    <div
                      key={i}
                      className="relative group aspect-square rounded-lg overflow-hidden border border-surface-container"
                    >
                      <img
                        src={url}
                        alt={`Product image ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="opacity-0 group-hover:opacity-100 bg-white/90 text-error p-1.5 rounded-full transition-opacity"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                      {i === 0 && (
                        <span className="absolute top-1 left-1 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                          Primary
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-2 border-dashed border-outline-variant rounded-xl p-8 text-center">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">
                    add_photo_alternate
                  </span>
                  <p className="text-label-sm text-on-surface-variant">
                    Drop images here or paste a URL above
                  </p>
                </div>
              )}

              <p className="text-label-sm text-on-surface-variant">
                Supports JPG, PNG, WebP. Recommended: 1080x1080px.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-surface-container p-6 space-y-4">
              <h2 className="text-headline-md text-on-surface">SEO</h2>
              <Input
                label="Meta Title"
                id="metaTitle"
                placeholder="SEO title (max 60 chars)"
                {...register('metaTitle')}
              />
              <div>
                <label className="block text-label-sm text-on-surface-variant mb-1">
                  Meta Description
                </label>
                <textarea
                  {...register('metaDesc')}
                  className="w-full px-3 py-2.5 rounded-lg border border-outline-variant bg-white text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  rows={3}
                  placeholder="SEO description (max 160 chars)"
                />
              </div>
            </div>

            <Button className="w-full" loading={createMutation.isPending}>
              Save Product
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
