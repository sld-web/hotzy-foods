'use client';

import Link from 'next/link';
import { useState } from 'react';
import { SITE_NAME } from '@/lib/constants';

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

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
            <Link href="/" className="text-label-md text-on-surface-variant hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/products" className="text-label-md text-on-surface-variant hover:text-primary transition-colors">
              Products
            </Link>
            <Link href="/about" className="text-label-md text-on-surface-variant hover:text-primary transition-colors">
              About Us
            </Link>
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative">
              <span className="material-symbols-outlined text-on-surface-variant">shopping_cart</span>
            </Link>
            <Link href="/login" className="text-label-md text-primary font-semibold hidden md:inline">
              Login
            </Link>
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
              <Link href="/" className="text-body-md text-on-surface-variant" onClick={() => setMenuOpen(false)}>
                Home
              </Link>
              <Link href="/products" className="text-body-md text-on-surface-variant" onClick={() => setMenuOpen(false)}>
                Products
              </Link>
              <Link href="/about" className="text-body-md text-on-surface-variant" onClick={() => setMenuOpen(false)}>
                About Us
              </Link>
              <Link href="/login" className="text-body-md text-primary font-semibold" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
