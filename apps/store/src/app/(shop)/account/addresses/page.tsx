'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc';
import { useCustomerAuth } from '@/lib/customer-auth-store';
import { Button, Input, Spinner } from '@hotzy/ui';
import { useToast } from '@hotzy/ui';
import Link from 'next/link';

export default function AddressesPage() {
  const router = useRouter();
  const { isAuthenticated } = useCustomerAuth();
  const { toast } = useToast();
  const { data: me, isLoading } = trpc.customerAuth.me.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const addAddress = trpc.customerAuth.addAddress.useMutation({
    onSuccess: () => {
      toast('Address added!', 'success');
      setShowForm(false);
      resetForm();
      refetch();
    },
    onError: (err) => toast(err.message || 'Failed to add address', 'error'),
  });

  const deleteAddress = trpc.customerAuth.deleteAddress.useMutation({
    onSuccess: () => {
      toast('Address removed', 'success');
      refetch();
    },
    onError: (err) => toast(err.message || 'Failed to remove address', 'error'),
  });

  const utils = trpc.useUtils();
  const refetch = () => utils.customerAuth.me.refetch();

  const [showForm, setShowForm] = useState(false);
  const [label, setLabel] = useState('');
  const [addrName, setAddrName] = useState('');
  const [phone, setPhone] = useState('');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const resetForm = () => {
    setLabel('');
    setAddrName('');
    setPhone('');
    setLine1('');
    setLine2('');
    setCity('');
    setProvince('');
    setIsDefault(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrName || !phone || !line1 || !city || !province) {
      toast('Please fill in all required fields', 'error');
      return;
    }
    addAddress.mutate({
      label: label || undefined,
      name: addrName,
      phone,
      line1,
      line2: line2 || undefined,
      city,
      province,
      isDefault,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  const addresses = me?.addresses || [];

  return (
    <div className="max-w-container mx-auto px-4 md:px-margin-desktop py-stack-lg">
      <Link
        href="/account"
        className="text-label-sm text-primary flex items-center gap-1 mb-6 hover:underline"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        Back to Account
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-headline-lg text-on-surface">Saved Addresses</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Address'}
        </Button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="max-w-lg bg-white rounded-xl border border-surface-container p-6 space-y-4 mb-8"
        >
          <Input
            label="Label (e.g. Home, Office)"
            id="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Home"
          />
          <Input
            label="Full Name *"
            id="addrName"
            value={addrName}
            onChange={(e) => setAddrName(e.target.value)}
            placeholder="Recipient name"
          />
          <Input
            label="Phone *"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone number"
          />
          <Input
            label="Address Line 1 *"
            id="line1"
            value={line1}
            onChange={(e) => setLine1(e.target.value)}
            placeholder="Street address"
          />
          <Input
            label="Address Line 2"
            id="line2"
            value={line2}
            onChange={(e) => setLine2(e.target.value)}
            placeholder="Apartment, suite, etc."
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="City *"
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
            />
            <Input
              label="Province *"
              id="province"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              placeholder="Province"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="rounded border-outline-variant"
            />
            <span className="text-body-md text-on-surface">Set as default address</span>
          </label>
          <Button loading={addAddress.isPending}>Save Address</Button>
        </form>
      )}

      {addresses.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {addresses.map((addr: any) => (
            <div
              key={addr.id}
              className="bg-white rounded-xl border border-surface-container p-4 relative"
            >
              {addr.isDefault && (
                <span className="absolute top-3 right-3 text-label-sm text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  Default
                </span>
              )}
              {addr.label && (
                <p className="text-label-sm text-on-surface-variant uppercase tracking-wide mb-1">
                  {addr.label}
                </p>
              )}
              <p className="text-body-md font-semibold text-on-surface">{addr.name}</p>
              <p className="text-body-md text-on-surface-variant">{addr.line1}</p>
              {addr.line2 && <p className="text-body-md text-on-surface-variant">{addr.line2}</p>}
              <p className="text-body-md text-on-surface-variant">
                {addr.city}, {addr.province}
              </p>
              <p className="text-body-md text-on-surface-variant mb-3">{addr.phone}</p>
              <button
                onClick={() => deleteAddress.mutate({ id: addr.id })}
                className="text-label-sm text-error hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">
            map
          </span>
          <p className="text-body-lg text-on-surface-variant">No saved addresses</p>
        </div>
      )}
    </div>
  );
}
