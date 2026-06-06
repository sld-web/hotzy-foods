'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc';
import { useCustomerAuth } from '@/lib/customer-auth-store';
import { Button, Input, Spinner } from '@hotzy/ui';
import { useToast } from '@hotzy/ui';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, customer } = useCustomerAuth();
  const { toast } = useToast();
  const { data: me, isLoading } = trpc.customerAuth.me.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const updateProfile = trpc.customerAuth.updateProfile.useMutation({
    onSuccess: () => {
      toast('Profile updated!', 'success');
    },
    onError: (err) => {
      toast(err.message || 'Failed to update profile', 'error');
    },
  });

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (me) {
      setName(me.name || '');
      setPhone(me.phone || '');
    }
  }, [me]);

  if (!isAuthenticated) return null;

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  const handleSave = () => {
    updateProfile.mutate({ name: name || undefined, phone: phone || undefined });
  };

  return (
    <div className="max-w-container mx-auto px-4 md:px-margin-desktop py-stack-lg">
      <Link
        href="/account"
        className="text-label-sm text-primary flex items-center gap-1 mb-6 hover:underline"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        Back to Account
      </Link>

      <h1 className="text-headline-lg text-on-surface mb-6">Profile Settings</h1>

      <div className="max-w-lg bg-white rounded-xl border border-surface-container p-6 space-y-4">
        <Input label="Email" id="email" value={me?.email || ''} disabled />
        <p className="text-label-sm text-on-surface-variant -mt-2">Email cannot be changed</p>
        <Input
          label="Name"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
        />
        <Input
          label="Phone"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone number"
        />

        <Button loading={updateProfile.isPending} onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}
