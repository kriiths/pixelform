
"use client";
import Link from 'next/link';
import Image from 'next/image';
import { ACCENT_COLORS, CATEGORY_ACCENT, type Category } from '@/lib/types';
import { useCart } from '@/app/cart/context';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { texts } from '@/app/content/texts';


interface ProductCardProps {
  id: number;
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

  // Get quantity of this product in cart
  const cartItem = items.find((item) => item.id === id && item.category === category);
  const cartQty = cartItem?.quantity || 0;
  const atMax = cartQty >= stock;

  // Prevent navigation when clicking the add-to-cart button
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (atMax) return;
    addItem({ id, name, price, image, category });
    setClicked(true);
    setTimeout(() => setClicked(false), 350);
  };

  return (
    <Link href={`/shop/${category}/${id}`}> 
      <div
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
          {/* Add to cart icon button */}
          <div className="absolute top-2 right-2 z-10 flex items-center">
            <Button
              type="button"
              variant="secondary"
              accentColor={accent}
              className={`p-2 rounded-full shadow bg-white/80 hover:bg-white focus:outline-none transition-transform duration-200 ${clicked ? 'scale-125' : 'scale-100'} ${(stock === 0 || atMax) ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-label={texts.product.addToCart}
              onClick={handleAddToCart}
              disabled={stock === 0 || atMax}
              style={{ minWidth: 0, width: 36, height: 36, padding: 0 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m13-9l2 9m-5-9V6a2 2 0 10-4 0v3" />
              </svg>
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
          className="text-lg font-bold mb-2"
          style={{ color: ACCENT_COLORS[accent] }}
        >
          {name}
        </h3>
        <p className="text-sm text-gray mb-4 flex-1">{description}</p>
        {/* Lagerstatus */}
        <p className={`text-sm font-medium mb-2 ${stock === 0 ? 'text-red-600' : 'text-green-700'}`}>
          {stock === 0 ? texts.product.outOfStock : `${texts.product.inStock} ${stock}`}
        </p>
        <p className="text-lg font-semibold text-black">{price}</p>
      </div>
    </Link>
  );
}

