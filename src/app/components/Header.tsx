"use client";

import Link from 'next/link';
import { useCart } from '../cart/context';
import { texts } from '../content/texts';
import { useState } from 'react';

export default function Header() {
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-semibold text-neutral-900 hover:text-neutral-700 transition">
          {texts.site.name}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/shop" className="text-neutral-700 hover:text-neutral-900 transition">
            {texts.nav.shop}
          </Link>
          {/* Junior link removed */}
          <Link href="/about" className="text-neutral-700 hover:text-neutral-900 transition">
            {texts.nav.about}
          </Link>
          <Link href="/cart" className="relative text-neutral-700 hover:text-neutral-900 transition">
            {texts.nav.cart}
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-neutral-700 hover:text-neutral-900"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-neutral-200">
          <nav className="flex flex-col px-6 py-4 gap-4">
            <Link
              href="/shop"
              onClick={() => setIsMenuOpen(false)}
              className="text-neutral-700 hover:text-neutral-900 transition"
            >
              {texts.nav.shop}
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMenuOpen(false)}
              className="text-neutral-700 hover:text-neutral-900 transition"
            >
              {texts.nav.about}
            </Link>
            <Link
              href="/cart"
              onClick={() => setIsMenuOpen(false)}
              className="text-neutral-700 hover:text-neutral-900 transition flex items-center gap-2"
            >
              {texts.nav.cart}
              {totalItems > 0 && (
                <span className="bg-pink-500 text-white text-xs px-2 py-1 rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
