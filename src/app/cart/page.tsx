"use client";

import { useCart } from '../cart/context';
import CartItem from '@/components/cart/CartItem';
import { texts } from '../content/texts';
import { paths } from '@/lib/paths';
import { PageContainer } from '@/components/ui/PageContainer';
import { Panel } from '@/components/ui/Panel';
import { LinkButton } from '@/components/ui/LinkButton';
import { EmptyCart } from '@/components/cart/EmptyCart';
import { PriceDisplay } from '@/components/ui/PriceDisplay';

export default function CartPage() {
  const { items, totalPrice } = useCart();

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <PageContainer>
      <h1 className="text-3xl font-semibold mb-8 text-neutral-900">
        {texts.cart.title}
      </h1>

      <Panel className="mb-6">
        {items.map((item) => (
          <CartItem key={`${item.category}-${item.id}`} item={item} />
        ))}
      </Panel>

      <Panel variant="muted">
        <div className="flex justify-between items-center mb-6">
          <span className="text-xl font-semibold text-neutral-900">
            {texts.cart.total}:
          </span>
          <PriceDisplay amount={totalPrice} size="xl" />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <LinkButton href={paths.shop} className="flex-1 text-center rounded">
            {texts.cart.continueShopping}
          </LinkButton>
          <LinkButton href={paths.checkout} variant="filled" className="flex-1 text-center">
            {texts.cart.goToCheckout}
          </LinkButton>
        </div>
      </Panel>
    </PageContainer>
  );
}
