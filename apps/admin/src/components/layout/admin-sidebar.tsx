'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: 'dashboard' },
  { href: '/admin/inventory', label: 'Inventory', icon: 'inventory_2' },
  { href: '/admin/products/new', label: 'Add Product', icon: 'add_circle' },
  { href: '/admin/orders', label: 'Orders', icon: 'shopping_cart' },
  { href: '/admin/customers', label: 'Customers', icon: 'group' },
  { href: '/admin/promotions', label: 'Promotions', icon: 'campaign' },
  { href: '/admin/website', label: 'Website', icon: 'web' },
  { href: '/admin/analytics', label: 'Analytics', icon: 'insights' },
];

export function AdminSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleNav = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={onClose} />}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-surface-container
          flex flex-col transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex items-center justify-between p-5 border-b border-surface-container">
          <Link href="/admin" onClick={onClose} className="text-headline-md text-primary">
            Hotzy Foods
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const active =
              pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <button
                key={item.href}
                onClick={() => handleNav(item.href)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-label-md text-left transition-colors ${
                  active
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-lg">{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-surface-container space-y-1">
          {user && (
            <div className="px-3 py-2 text-label-sm text-on-surface-variant truncate">
              {user.name}
              <span className="block text-[11px] opacity-60">{user.email}</span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-label-md text-on-surface-variant hover:bg-surface-container w-full transition-colors"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
