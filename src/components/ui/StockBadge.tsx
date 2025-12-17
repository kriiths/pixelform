import { texts } from '@/app/content/texts';

interface StockBadgeProps {
  stock: number;
}

export function StockBadge({ stock }: StockBadgeProps) {
  const isOutOfStock = stock === 0;
  const colorClass = isOutOfStock ? 'text-red-600' : 'text-green-700';
  const text = isOutOfStock ? texts.product.outOfStock : `${texts.product.inStock} ${stock}`;

  return (
    <p className={`text-sm font-medium ${colorClass}`}>
      {text}
    </p>
  );
}
