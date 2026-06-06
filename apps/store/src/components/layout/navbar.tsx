'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/lib/cart-store';
import { useCustomerAuth } from '@/lib/customer-auth-store';
import { SITE_NAME } from '@/lib/constants';

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const itemCount = useCart((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
  const { isAuthenticated, customer, logout } = useCustomerAuth();
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-surface-container">
      <div className="max-w-container mx-auto px-4 md:px-margin-desktop">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-headline-md text-primary font-heading">
            {SITE_NAME}
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-label-md text-on-surface-variant hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="text-label-md text-on-surface-variant hover:text-primary transition-colors"
            >
              Products
            </Link>
            <Link
              href="/about"
              className="text-label-md text-on-surface-variant hover:text-primary transition-colors"
            >
              About Us
            </Link>
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative">
              <span className="material-symbols-outlined text-on-surface-variant">
                shopping_cart
              </span>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setShowAccountMenu(!showAccountMenu)}
                  className="flex items-center gap-1 text-label-md text-primary font-semibold hover:underline"
                >
                  {customer?.name || customer?.email}
                  <span className="material-symbols-outlined text-sm">arrow_drop_down</span>
                </button>
                {showAccountMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowAccountMenu(false)} />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border border-surface-container shadow-lg z-20 py-2">
                      <Link
                        href="/orders"
                        className="block px-4 py-2 text-label-md text-on-surface-variant hover:bg-surface-container"
                        onClick={() => setShowAccountMenu(false)}
                      >
                        My Orders
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setShowAccountMenu(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-label-md text-error hover:bg-surface-container"
                      >
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="text-label-md text-primary font-semibold hidden md:inline"
              >
                Login
              </Link>
            )}

            <button
              className="md:hidden material-symbols-outlined text-on-surface-variant"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              menu
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-surface-container pt-4">
            <div className="flex flex-col gap-3">
              <Link
                href="/"
                className="text-body-md text-on-surface-variant"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/products"
                className="text-body-md text-on-surface-variant"
                onClick={() => setMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/about"
                className="text-body-md text-on-surface-variant"
                onClick={() => setMenuOpen(false)}
              >
                About Us
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    href="/orders"
                    className="text-body-md text-on-surface-variant"
                    onClick={() => setMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="text-body-md text-error text-left"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="text-body-md text-primary font-semibold"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
