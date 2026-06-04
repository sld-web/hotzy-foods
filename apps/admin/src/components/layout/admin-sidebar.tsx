'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: 'dashboard' },
  { href: '/admin/inventory', label: 'Inventory', icon: 'inventory_2' },
  { href: '/admin/products/new', label: 'Add Product', icon: 'add_circle' },
  { href: '/admin/orders', label: 'Orders', icon: 'shopping_cart' },
  { href: '/admin/customers', label: 'Customers', icon: 'group' },
  { href: '/admin/promotions', label: 'Promotions', icon: 'campaign' },
  { href: '/admin/website', label: 'Website', icon: 'web' },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('hotzy-admin-token');
    window.location.href = '/login';
  };

  return (
    <aside className="w-64 bg-white border-r border-surface-container min-h-screen flex flex-col">
      <div className="p-5 border-b border-surface-container">
        <Link href="/admin" className="text-headline-md text-primary">
          Hotzy Foods
        </Link>
        <p className="text-label-sm text-on-surface-variant mt-1">Managing Spicy Excellence</p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-label-md transition-colors ${
                active ? 'bg-primary/10 text-primary font-semibold' : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-lg">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-surface-container">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-label-md text-on-surface-variant hover:bg-surface-container w-full transition-colors"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
          Logout
        </button>
      </div>
    </aside>
  );
}
