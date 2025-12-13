"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../cart/context';
import { texts } from '../content/texts';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [isCompleted, setIsCompleted] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const handleCompleteOrder = () => {
    // Mockad betalning - generera ordernummer
    const newOrderNumber = `PV-${Date.now()}`;
    setOrderNumber(newOrderNumber);
    setIsCompleted(true);
    clearCart();
  };

  if (items.length === 0 && !isCompleted) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-24">
        <h1 className="text-3xl font-semibold mb-6 text-neutral-900">{texts.checkout.title}</h1>
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

  if (isCompleted) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-24">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
          <div className="text-5xl mb-4">✓</div>
          <h1 className="text-3xl font-semibold mb-4 text-neutral-900">{texts.checkout.thankYou}</h1>
          <p className="text-lg text-neutral-700 mb-2">
            {texts.checkout.orderNumber}: <span className="font-mono font-semibold">{orderNumber}</span>
          </p>
          <p className="text-neutral-600 mb-8">
            {texts.checkout.confirmationSent}
          </p>
          <Link
            href="/shop"
            className="inline-block bg-neutral-900 text-white px-8 py-3 rounded hover:bg-neutral-700 transition"
          >
            {texts.checkout.backToShop}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold mb-8 text-neutral-900">{texts.checkout.title}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Ordersammanfattning */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-neutral-900">{texts.checkout.orderSummary}</h2>
          <div className="bg-white border border-neutral-200 rounded-lg p-6">
            {items.map((item) => (
              <div key={`${item.category}-${item.id}`} className="flex justify-between mb-3 pb-3 border-b border-neutral-100 last:border-0">
                <div>
                  <p className="font-medium text-neutral-900">{item.name}</p>
                  <p className="text-sm text-neutral-600">Antal: {item.quantity}</p>
                </div>
                <p className="font-medium text-neutral-900">
                  {parseInt(item.price.replace(/\D/g, ''), 10) * item.quantity} kr
                </p>
              </div>
            ))}
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-neutral-300">
              <span className="text-lg font-semibold text-neutral-900">{texts.cart.total}:</span>
              <span className="text-2xl font-bold text-neutral-900">{totalPrice} kr</span>
            </div>
          </div>
        </div>

        {/* Betalning (mockad) */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-neutral-900">{texts.checkout.payment}</h2>
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6">
            <div className="mb-6">
              <p className="text-sm text-neutral-600 mb-4">
                {texts.checkout.mockPayment} - Ingen verklig betalning genomförs.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{texts.forms.name}</label>
                  <input
                    type="text"
                    className="w-full border border-neutral-300 rounded px-3 py-2"
                    placeholder={texts.forms.namePlaceholder}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{texts.forms.email}</label>
                  <input
                    type="email"
                    className="w-full border border-neutral-300 rounded px-3 py-2"
                    placeholder={texts.forms.emailPlaceholder}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{texts.forms.address}</label>
                  <input
                    type="text"
                    className="w-full border border-neutral-300 rounded px-3 py-2"
                    placeholder={texts.forms.addressPlaceholder}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleCompleteOrder}
              className="w-full bg-neutral-900 text-white px-8 py-3 rounded hover:bg-neutral-700 transition font-semibold"
            >
              {texts.checkout.completeOrder}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
