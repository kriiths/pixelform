"use client";

import Link from 'next/link';
import { useCart } from '@/app/cart/context';
import { texts } from '@/app/content/texts';
import { useState } from 'react';

export default function Header() {
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-light sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-8 py-5 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-black tracking-tight hover:text-gray-700 transition">
          {texts.site.name}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <div className="relative group">
            <button className="text-gray-700 hover:text-black transition px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-pixel">
              {texts.nav.shop}
              <svg className="inline w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-light rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-20">
              <Link href="/shop" className="block px-4 py-2 text-black font-semibold hover:bg-gray-light hover:text-black transition rounded-t">{texts.nav.showAll}</Link>
              <Link href="/shop/pixelparla" className="block px-4 py-2 text-pixel hover:bg-pixel/10 hover:text-pixel transition">{texts.shop.categories.pixelparla}</Link>
              <Link href="/shop/resin" className="block px-4 py-2 text-resin hover:bg-resin/10 hover:text-resin transition">{texts.shop.categories.resin}</Link>
              <Link href="/shop/junior" className="block px-4 py-2 text-black hover:bg-gray-light hover:text-black transition rounded-b">{texts.shop.categories.junior}</Link>
            </div>
          </div>
          <Link href="/about" className="text-gray-700 hover:text-black transition px-2 py-1 rounded">
            {texts.nav.about}
          </Link>
          <Link href="/cart" className="relative text-gray-700 hover:text-black transition px-2 py-1 rounded inline-block">
            <svg className="inline w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-pixel text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                {totalItems}
              </span>
            )}
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-gray-700 hover:text-black"
          aria-label={texts.nav.toggleMenu}
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="md:hidden bg-white border-t border-gray-light shadow-sm">
          <nav className="flex flex-col px-6 py-4 gap-4">
            <Link
              href="/shop"
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-700 hover:text-black transition"
            >
              {texts.nav.shop}
            </Link>
            <Link
              href="/shop/junior"
              onClick={() => setIsMenuOpen(false)}
              className="text-pixel hover:text-pixel transition"
            >
              {texts.nav.junior}
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-700 hover:text-black transition"
            >
              {texts.nav.about}
            </Link>
            <Link
              href="/cart"
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-700 hover:text-black transition flex items-center gap-2"
            >
              <svg className="inline w-6 h-6 mr-1 align-text-bottom" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              {texts.nav.cart}
              {totalItems > 0 && (
                <span className="bg-pixel text-white text-xs px-2 py-1 rounded-full">
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
