"use client";

import { useState } from 'react';
import { useCart } from '../cart/context';
import { texts } from '../content/texts';
import { testIds } from '@/lib/testids';
import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
import { PageContainer } from '@/components/ui/PageContainer';
import { FormField } from '@/components/ui/FormField';
import { OrderSummaryItem } from '@/components/checkout/OrderSummaryItem';
import { OrderConfirmation } from '@/components/checkout/OrderConfirmation';
import { EmptyCheckout } from '@/components/checkout/EmptyCheckout';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [isCompleted, setIsCompleted] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const handleCompleteOrder = () => {
    const newOrderNumber = `PV-${Date.now()}`;
    setOrderNumber(newOrderNumber);
    setIsCompleted(true);
    clearCart();
  };

  const hasEmptyCart = items.length === 0 && !isCompleted;

  if (hasEmptyCart) {
    return <EmptyCheckout />;
  }

  if (isCompleted) {
    return <OrderConfirmation orderNumber={orderNumber} />;
  }

  return (
    <PageContainer>
      <h1 className="text-3xl font-semibold mb-8 text-neutral-900">
        {texts.checkout.title}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section>
          <h2 className="text-xl font-semibold mb-4 text-neutral-900">
            {texts.checkout.orderSummary}
          </h2>
          <Panel testId={testIds.orderSummary}>
            {items.map((item) => (
              <OrderSummaryItem key={`${item.category}-${item.id}`} item={item} />
            ))}
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-neutral-300">
              <span className="text-lg font-semibold text-neutral-900">
                {texts.cart.total}:
              </span>
              <span className="text-2xl font-bold text-neutral-900">
                {totalPrice}{texts.currency.suffix}
              </span>
            </div>
          </Panel>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-neutral-900">
            {texts.checkout.payment}
          </h2>
          <Panel variant="muted" testId={testIds.checkoutForm}>
            <p className="text-sm text-neutral-600 mb-4">
              {texts.checkout.mockPayment}
            </p>

            <div className="space-y-4 mb-6">
              <FormField
                label={texts.forms.name}
                type="text"
                data-testid={testIds.checkoutNameInput}
                placeholder={texts.forms.namePlaceholder}
              />
              <FormField
                label={texts.forms.email}
                type="email"
                data-testid={testIds.checkoutEmailInput}
                placeholder={texts.forms.emailPlaceholder}
              />
              <FormField
                label={texts.forms.address}
                type="text"
                data-testid={testIds.checkoutAddressInput}
                placeholder={texts.forms.addressPlaceholder}
              />
            </div>

            <Button
              onClick={handleCompleteOrder}
              data-testid={testIds.submitOrderButton}
              fullWidth
            >
              {texts.checkout.completeOrder}
            </Button>
          </Panel>
        </section>
      </div>
    </PageContainer>
  );
}
