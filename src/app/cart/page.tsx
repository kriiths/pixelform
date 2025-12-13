"use client";

import Link from 'next/link';
import { useCart } from '../cart/context';
import CartItem from '../components/CartItem';
import { texts } from '../content/texts';

export default function CartPage() {
  const { items, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-24">
        <h1 className="text-3xl font-semibold mb-6 text-neutral-900">{texts.cart.title}</h1>
        <p className="text-lg text-neutral-700 mb-6">{texts.cart.empty}</p>
        <Link
          href="/shop"
          className="inline-block border border-neutral-900 px-6 py-3 hover:bg-neutral-900 hover:text-white transition"
        >
          {texts.cart.continueShopping}
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold mb-8 text-neutral-900">{texts.cart.title}</h1>

      <div className="bg-white rounded-lg border border-neutral-200 p-6 mb-6">
        {items.map((item) => (
          <CartItem key={`${item.category}-${item.id}`} item={item} />
        ))}
      </div>

      <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
        <div className="flex justify-between items-center mb-6">
          <span className="text-xl font-semibold text-neutral-900">{texts.cart.total}:</span>
          <span className="text-2xl font-bold text-neutral-900">{totalPrice} kr</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/shop"
            className="flex-1 text-center border border-neutral-900 px-6 py-3 hover:bg-neutral-100 transition rounded"
          >
            {texts.cart.continueShopping}
          </Link>
          <Link
            href="/checkout"
            className="flex-1 text-center bg-neutral-900 text-white px-6 py-3 hover:bg-neutral-700 transition rounded"
          >
            {texts.cart.goToCheckout}
          </Link>
        </div>
      </div>
    </main>
  );
}
