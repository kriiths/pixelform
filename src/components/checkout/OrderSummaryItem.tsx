import { texts } from '@/app/content/texts';
import type { CartItem } from '@/lib/types';

interface OrderSummaryItemProps {
  item: CartItem;
}

export function OrderSummaryItem({ item }: OrderSummaryItemProps) {
  const itemTotal = parseInt(item.price.replace(/\D/g, ''), 10) * item.quantity;

  return (
    <div className="flex justify-between mb-3 pb-3 border-b border-neutral-100 last:border-0">
      <div>
        <p className="font-medium text-neutral-900">{item.name}</p>
        <p className="text-sm text-neutral-600">
          {texts.cart.quantity}: {item.quantity}
        </p>
      </div>
      <p className="font-medium text-neutral-900">
        {itemTotal}{texts.currency.suffix}
      </p>
    </div>
  );
}
