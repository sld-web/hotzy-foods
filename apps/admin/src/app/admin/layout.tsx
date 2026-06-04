'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { useAuthStore } from '@/lib/auth-store';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const isAuthenticated = !!token;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-[1400px] mx-auto">{children}</div>
      </main>
    </div>
  );
}
