"use client";

import { useCart } from '@/app/cart/context';
import { texts } from '@/app/content/texts';
import type { CartItem as CartItemType } from '@/lib/types';
import Link from 'next/link';
import { testIds } from '@/lib/testids';
import { paths } from '@/lib/paths';
import { ProductImage } from '@/components/ui/ProductImage';
import { QuantityControl } from '@/components/ui/QuantityControl';
import { PriceDisplay } from '@/components/ui/PriceDisplay';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  const handleDecrease = () => updateQuantity(item.id, item.category, item.quantity - 1);
  const handleIncrease = () => updateQuantity(item.id, item.category, item.quantity + 1);
  const handleRemove = () => removeItem(item.id, item.category);

  const itemTotal = parseInt(item.price.replace(/\D/g, ''), 10) * item.quantity;

  return (
    <div className="flex gap-4 border-b border-neutral-200 pb-4 mb-4" data-testid={testIds.cartItem}>
      <ProductImage src={item.image} alt={item.name} size="sm" />

      <div className="flex-1">
        <h3 className="font-semibold text-neutral-900">
          <Link href={paths.productDetail(item.category, String(item.id))} className="hover:underline focus:underline">
            {item.name}
          </Link>
        </h3>
        <p className="text-sm text-neutral-600">{item.price}</p>

        <div className="mt-2">
          <QuantityControl
            quantity={item.quantity}
            onDecrease={handleDecrease}
            onIncrease={handleIncrease}
            decreaseTestId={testIds.decreaseQuantityButton}
            increaseTestId={testIds.increaseQuantityButton}
          />
        </div>
      </div>

      <div className="flex flex-col items-end justify-between">
        <PriceDisplay amount={itemTotal} size="md" className="font-semibold" />
        <button
          onClick={handleRemove}
          className="text-sm text-red-600 hover:text-red-700 transition"
          data-testid={testIds.removeFromCartButton}
        >
          {texts.cart.remove}
        </button>
      </div>
    </div>
  );
}
