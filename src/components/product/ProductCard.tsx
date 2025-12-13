
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
}

export default function ProductCard({ id, name, description, price, image, category }: ProductCardProps) {
  const accent = CATEGORY_ACCENT[category];
  const { addItem, items } = useCart();
  const [clicked, setClicked] = useState(false);

  // Check if this product is in the cart
  const inCart = items.some((item) => item.id === id && item.category === category);

  // Prevent navigation when clicking the add-to-cart button
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
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
              className={`p-2 rounded-full shadow bg-white/80 hover:bg-white focus:outline-none transition-transform duration-200 ${clicked ? 'scale-125' : 'scale-100'}`}
              aria-label={texts.product.addToCart}
              onClick={handleAddToCart}
              style={{ minWidth: 0, width: 36, height: 36, padding: 0 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m13-9l2 9m-5-9V6a2 2 0 10-4 0v3" />
              </svg>
            </Button>
            {inCart && (
              <span
                className="ml-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-500 text-white animate-fade-in"
                style={{ minWidth: 0 }}
              >
                ✓
              </span>
            )}
          </div>
        </div>
        <h3 
          className="text-lg font-bold mb-2"
          style={{ color: ACCENT_COLORS[accent] }}
        >
          {name}
        </h3>
        <p className="text-sm text-gray mb-4 flex-1">{description}</p>
        <p className="text-lg font-semibold text-black">{price}</p>
      </div>
    </Link>
  );
}

