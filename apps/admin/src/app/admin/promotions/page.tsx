'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { trpc } from '@/lib/trpc';
import { Button, Modal, Input, Select, ConfirmDialog } from '@hotzy/ui';

const PROMO_TYPES = [
  { value: 'PERCENTAGE', label: 'Percentage Off' },
  { value: 'FIXED_AMOUNT', label: 'Fixed Amount Off' },
  { value: 'FREE_SHIPPING', label: 'Free Shipping' },
] as const;

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-800',
  SCHEDULED: 'bg-blue-100 text-blue-800',
  EXPIRED: 'bg-gray-100 text-gray-800',
};

export default function PromotionsPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: promos, isLoading, refetch } = trpc.admin.promo.list.useQuery();
  const createMutation = trpc.admin.promo.create.useMutation({
    onSuccess: () => {
      setShowCreate(false);
      refetch();
    },
  });
  const deleteMutation = trpc.admin.promo.delete.useMutation({
    onSuccess: () => {
      setDeleteId(null);
      refetch();
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>({
    defaultValues: { type: 'PERCENTAGE', maxUses: 100, maxPerUser: 1 },
  });

  const onSubmit = (data: any) => {
    createMutation.mutate({
      code: data.code,
      type: data.type,
      value: Number(data.value),
      minOrderAmount: data.minOrderAmount ? Number(data.minOrderAmount) : undefined,
      maxUses: data.maxUses ? Number(data.maxUses) : undefined,
      maxPerUser: data.maxPerUser ? Number(data.maxPerUser) : undefined,
      description: data.description || undefined,
      startsAt: data.startsAt || undefined,
      expiresAt: data.expiresAt || undefined,
    });
  };

  const openCreate = () => {
    reset();
    setShowCreate(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-headline-lg text-on-surface">Promotions</h1>
        <Button onClick={openCreate}>Create New Promo</Button>
      </div>

      <div className="bg-white rounded-xl border border-surface-container overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-gray border-b border-surface-container">
                <th className="text-left px-4 py-3 text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Code
                </th>
                <th className="text-left px-4 py-3 text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Type
                </th>
                <th className="text-left px-4 py-3 text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Value
                </th>
                <th className="text-left px-4 py-3 text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Usage
                </th>
                <th className="text-left px-4 py-3 text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right px-4 py-3 text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-on-surface-variant">
                    Loading...
                  </td>
                </tr>
              ) : !promos || promos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-on-surface-variant">
                    No promotions yet
                  </td>
                </tr>
              ) : (
                promos.map((promo) => (
                  <tr key={promo.id} className="hover:bg-surface-container/20 transition-colors">
                    <td className="px-4 py-3 text-body-md text-on-surface font-semibold">
                      {promo.code}
                    </td>
                    <td className="px-4 py-3 text-body-md text-on-surface-variant">
                      {promo.type === 'PERCENTAGE'
                        ? 'Percentage Off'
                        : promo.type === 'FIXED_AMOUNT'
                          ? 'Fixed Amount'
                          : 'Free Shipping'}
                    </td>
                    <td className="px-4 py-3 text-body-md text-on-surface">
                      {promo.type === 'PERCENTAGE'
                        ? `${Number(promo.value)}%`
                        : promo.type === 'FREE_SHIPPING'
                          ? '—'
                          : `Rs. ${Number(promo.value)}`}
                    </td>
                    <td className="px-4 py-3 text-body-md text-on-surface-variant">
                      {promo.currentUses}
                      {promo.maxUses ? ` / ${promo.maxUses}` : ''}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-label-sm ${STATUS_STYLES[promo.status] ?? ''}`}
                      >
                        {promo.status.toLowerCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setDeleteId(promo.id)}
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
      </div>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create New Promo Code">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Code"
            id="code"
            placeholder="e.g. HEATWAVE20"
            error={errors.code?.message as string}
            {...register('code', { required: 'Code is required' })}
          />
          <Select label="Type" id="type" {...register('type')} options={[...PROMO_TYPES]} />
          <Input
            label="Value"
            id="value"
            type="number"
            step="0.01"
            placeholder="20"
            error={errors.value?.message as string}
            {...register('value', { required: 'Value is required', valueAsNumber: true })}
          />
          <Input
            label="Min Order Amount (Rs.)"
            id="minOrderAmount"
            type="number"
            step="0.01"
            placeholder="1000"
            {...register('minOrderAmount', { valueAsNumber: true })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Max Uses"
              id="maxUses"
              type="number"
              placeholder="100"
              {...register('maxUses', { valueAsNumber: true })}
            />
            <Input
              label="Max Per User"
              id="maxPerUser"
              type="number"
              placeholder="1"
              {...register('maxPerUser', { valueAsNumber: true })}
            />
          </div>
          <Input
            label="Description"
            id="description"
            placeholder="Promo description..."
            {...register('description')}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              id="startsAt"
              type="datetime-local"
              {...register('startsAt')}
            />
            <Input
              label="Expiry Date"
              id="expiresAt"
              type="datetime-local"
              {...register('expiresAt')}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setShowCreate(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={createMutation.isPending}>
              Create Promo
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate({ id: deleteId })}
        title="Delete Promo Code"
        message="Are you sure you want to delete this promo code? This action cannot be undone."
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
