import Link from 'next/link';
import { texts } from '@/app/content/texts';
import { paths } from '@/lib/paths';
import { testIds } from '@/lib/testids';
import { CartIcon, ChevronDownIcon } from '@/components/ui/Icons';
import { CartBadge } from '@/components/ui/CartBadge';

interface DesktopNavProps {
  totalItems: number;
}

export function DesktopNav({ totalItems }: DesktopNavProps) {
  return (
    <nav className="hidden md:flex items-center gap-8" data-testid={testIds.headerNav}>
      <div className="relative group">
        <button 
          className="text-gray-700 hover:text-black transition px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-pixel" 
          data-testid={testIds.shopDropdown}
        >
          {texts.nav.shop}
          <ChevronDownIcon />
        </button>
        <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-light rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-20">
          <Link href={paths.shop} className="block px-4 py-2 text-black font-semibold hover:bg-gray-light hover:text-black transition rounded-t">
            {texts.nav.showAll}
          </Link>
          <Link href={paths.pixelParla} className="block px-4 py-2 text-pixel hover:bg-pixel/10 hover:text-pixel transition">
            {texts.shop.categories.pixelparla}
          </Link>
          <Link href={paths.resin} className="block px-4 py-2 text-resin hover:bg-resin/10 hover:text-resin transition">
            {texts.shop.categories.resin}
          </Link>
          <Link href={paths.junior} className="block px-4 py-2 text-black hover:bg-gray-light hover:text-black transition rounded-b">
            {texts.shop.categories.junior}
          </Link>
        </div>
      </div>
      <Link href={paths.about} className="text-gray-700 hover:text-black transition px-2 py-1 rounded">
        {texts.nav.about}
      </Link>
      <Link href={paths.cart} className="relative text-gray-700 hover:text-black transition px-2 py-1 rounded inline-block">
        <CartIcon className="inline w-6 h-6" />
        <CartBadge count={totalItems} testId={testIds.cartBadge} />
      </Link>
    </nav>
  );
}

interface MobileNavProps {
  totalItems: number;
  onClose: () => void;
}

export function MobileNav({ totalItems, onClose }: MobileNavProps) {
  return (
    <div className="md:hidden bg-white border-t border-gray-light shadow-sm" data-testid={testIds.mobileMenu}>
      <nav className="flex flex-col px-6 py-4 gap-4">
        <Link href={paths.shop} onClick={onClose} className="text-gray-700 hover:text-black transition">
          {texts.nav.shop}
        </Link>
        <Link href={paths.junior} onClick={onClose} className="text-pixel hover:text-pixel transition">
          {texts.nav.junior}
        </Link>
        <Link href={paths.about} onClick={onClose} className="text-gray-700 hover:text-black transition">
          {texts.nav.about}
        </Link>
        <Link href={paths.cart} onClick={onClose} className="text-gray-700 hover:text-black transition flex items-center gap-2">
          <CartIcon className="inline w-6 h-6 mr-1 align-text-bottom" />
          {texts.nav.cart}
          <CartBadge count={totalItems} variant="mobile" />
        </Link>
      </nav>
    </div>
  );
}
