'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { useAuthStore } from '@/lib/auth-store';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const isAuthenticated = !!token;
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 flex flex-col min-w-0">
        <div className="sticky top-0 z-30 bg-surface border-b border-surface-container lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-4 text-on-surface-variant hover:text-on-surface"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
        <div className="flex-1 p-4 sm:p-6 overflow-auto">
          <div className="max-w-[1400px] mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
}
