"use client";

import Image from 'next/image';
import { useCart } from '@/app/cart/context';
import { texts } from '@/app/content/texts';
import type { CartItem as CartItemType } from '@/lib/types';
import Link from 'next/link';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex gap-4 border-b border-neutral-200 pb-4 mb-4">
      <div className="relative w-24 h-24 bg-neutral-100 rounded">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-contain rounded"
          sizes="96px"
        />
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-neutral-900">
          <Link href={`/shop/${item.category}/${item.id}`} className="hover:underline focus:underline">
            {item.name}
          </Link>
        </h3>
        <p className="text-sm text-neutral-600">{item.price}</p>

        <div className="flex items-center gap-3 mt-2">
          <label className="text-sm text-neutral-700">{texts.cart.quantity}:</label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQuantity(item.id, item.category, item.quantity - 1)}
              className="w-7 h-7 flex items-center justify-center border border-neutral-300 rounded hover:bg-neutral-100 transition"
              aria-label={texts.cart.decreaseQuantity}
            >
              -
            </button>
            <span className="w-8 text-center">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, item.category, item.quantity + 1)}
              className="w-7 h-7 flex items-center justify-center border border-neutral-300 rounded hover:bg-neutral-100 transition"
              aria-label={texts.cart.increaseQuantity}
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end justify-between">
        <p className="font-semibold text-neutral-900">
          {parseInt(item.price.replace(/\D/g, ''), 10) * item.quantity}{texts.currency.suffix}
        </p>
        <button
          onClick={() => removeItem(item.id, item.category)}
          className="text-sm text-red-600 hover:text-red-700 transition"
        >
          {texts.cart.remove}
        </button>
      </div>
    </div>
  );
}
