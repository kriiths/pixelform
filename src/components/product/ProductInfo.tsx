import Link from 'next/link';
import { texts } from '@/app/content/texts';
import { paths } from '@/lib/paths';
import { testIds } from '@/lib/testids';
import { Button } from '@/components/ui/Button';
import { StockBadge } from '@/components/ui/StockBadge';
import { CATEGORY_ACCENT, type Category } from '@/lib/types';
import type { Product } from '@/lib/types';

interface ProductInfoProps {
  product: Product;
  category: string;
  cartQty: number;
  onAddToCart: () => void;
  onRemoveFromCart: () => void;
}

export function ProductInfo({ product, category, cartQty, onAddToCart, onRemoveFromCart }: ProductInfoProps) {
  const isOutOfStock = product.stock === 0;

  return (
    <div className="flex flex-col items-start bg-offwhite p-0 md:p-4 rounded-xl">
      <h1 className="text-4xl font-extrabold mb-4 text-black leading-tight">
        {product.name}
      </h1>
      <p className="text-xl font-semibold mb-6 text-gray">{product.price}</p>
      <p className="text-gray-700 mb-4 text-lg leading-relaxed">{product.description}</p>

      <div className="mb-6">
        <StockBadge stock={product.stock} />
      </div>

      {cartQty > 0 && (
        <div className="flex items-center gap-3 mb-2">
          <p className="text-base font-medium text-blue-700">
            {`${texts.product.inCart} ${cartQty}`}
          </p>
          <button
            type="button"
            className="text-xs px-2 py-1 rounded bg-red-100 text-red-700 border border-red-200 hover:bg-red-200 transition"
            onClick={onRemoveFromCart}
            data-testid={testIds.removeFromCartButton}
          >
            {texts.product.removeFromCart}
          </button>
        </div>
      )}

      <Button
        onClick={onAddToCart}
        variant="accent"
        accentColor={CATEGORY_ACCENT[category as Category]}
        className={`px-8 py-4 text-lg ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isOutOfStock}
        data-testid={testIds.addToCartPageButton}
      >
        {texts.product.addToCart}
      </Button>

      <Link
        href={paths.shop}
        className="mt-8 text-resin hover:underline text-base font-medium"
        data-testid={testIds.backToShopLink}
      >
        {texts.product.backArrow} {texts.product.backToShop}
      </Link>
    </div>
  );
}
