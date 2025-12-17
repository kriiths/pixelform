"use client";

import Link from 'next/link';
import { useCart } from '@/app/cart/context';
import { texts } from '@/app/content/texts';
import { useState } from 'react';
import { testIds } from '@/lib/testids';
import { paths } from '@/lib/paths';
import { DesktopNav, MobileNav } from './Navigation';
import { MenuIcon, CloseIcon } from '@/components/ui/Icons';

export default function Header() {
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="bg-white border-b border-gray-light sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-8 py-5 flex items-center justify-between">
        <Link href={paths.home} className="text-2xl font-bold text-black tracking-tight hover:text-gray-700 transition">
          {texts.site.name}
        </Link>

        <DesktopNav totalItems={totalItems} />

        <button
          onClick={toggleMenu}
          className="md:hidden text-gray-700 hover:text-black"
          aria-label={texts.nav.toggleMenu}
          data-testid={testIds.mobileMenuButton}
        >
          {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {isMenuOpen && <MobileNav totalItems={totalItems} onClose={closeMenu} />}
    </header>
  );
}
