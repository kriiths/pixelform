"use client";

import Link from 'next/link';
import Image from 'next/image';
import { ACCENT_COLORS, CATEGORY_ACCENT, type Category } from '@/lib/types';
import { useCart } from '@/app/cart/context';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { texts } from '@/app/content/texts';
import { testIds } from '@/lib/testids';
import { paths } from '@/lib/paths';
import { StockBadge } from '@/components/ui/StockBadge';
import { AddToCartIcon } from '@/components/ui/Icons';

interface ProductCardProps {
  id: string | number;
  name: string;
  description: string;
  price: string;
  image: string;
  category: Category;
  stock: number;
}

export default function ProductCard({ id, name, description, price, image, category, stock }: ProductCardProps) {
  const accent = CATEGORY_ACCENT[category];
  const { addItem, items } = useCart();
  const [clicked, setClicked] = useState(false);

  const cartItem = items.find((item) => item.id === id && item.category === category);
  const cartQty = cartItem?.quantity || 0;
  const atMax = cartQty >= stock;
  const isDisabled = stock === 0 || atMax;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (atMax) return;
    addItem({ id, name, price, image, category }, stock);
    setClicked(true);
    setTimeout(() => setClicked(false), 350);
  };

  const buttonClassName = `p-2 rounded-full shadow bg-white/80 hover:bg-white focus:outline-none transition-transform duration-200 ${clicked ? 'scale-125' : 'scale-100'} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`;

  return (
    <Link href={paths.productDetail(category, String(id))}>
      <div
        data-testid={testIds.productCard}
        className="bg-white border border-gray-light rounded-xl p-6 hover:shadow-subtle transition-all duration-200 cursor-pointer group flex flex-col h-full relative"
        style={{ borderTop: `4px solid ${ACCENT_COLORS[accent]}` }}
      >
        <div className="relative h-48 mb-5 bg-offwhite rounded-lg overflow-hidden flex items-center justify-center">
          <Image
            src={image}
            alt={name}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-200"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-2 right-2 z-10 flex items-center">
            <Button
              type="button"
              variant="secondary"
              accentColor={accent}
              data-testid={testIds.addToCartCardButton}
              aria-label={texts.product.addToCart}
              onClick={handleAddToCart}
              disabled={isDisabled}
              className={buttonClassName}
              style={{ minWidth: 0, width: 36, height: 36, padding: 0 }}
            >
              <AddToCartIcon />
              {cartQty > 0 && (
                <span
                  className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 border border-white shadow"
                  style={{ minWidth: 18, minHeight: 18, lineHeight: '18px', pointerEvents: 'none' }}
                >
                  {cartQty}
                </span>
              )}
            </Button>
          </div>
        </div>
        <h3
          className="text-lg font-bold mb-2 group-hover:opacity-80 transition-colors"
          style={{ color: ACCENT_COLORS[accent] }}
          data-testid={testIds.productName}
        >
          {name}
        </h3>
        <p className="text-sm text-gray mb-4 flex-1">{description}</p>
        <StockBadge stock={stock} />
        <p className="text-lg font-semibold text-black mt-2">{price}</p>
      </div>
    </Link>
  );
}

