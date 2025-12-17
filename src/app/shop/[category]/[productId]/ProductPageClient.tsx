"use client";

import { useCart } from '@/app/cart/context';
import { testIds } from '@/lib/testids';
import type { Product } from '@/lib/types';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductInfo } from '@/components/product/ProductInfo';

interface Props {
  product: Product;
  category: string;
}

export default function ProductPageClient({ product, category }: Props) {
  const { addItem, removeItem, items } = useCart();

  const cartItem = items.find((item) => item.id === product.id && item.category === category);
  const cartQty = cartItem?.quantity || 0;

  const images: string[] = product.images?.length ? product.images : [product.image];

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category,
    }, product.stock);
  };

  const handleRemoveFromCart = () => {
    removeItem(product.id, category);
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-16 bg-offwhite min-h-[80vh]" data-testid={testIds.productDetailContainer}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <ProductGallery images={images} productName={product.name} />
        <ProductInfo
          product={product}
          category={category}
          cartQty={cartQty}
          onAddToCart={handleAddToCart}
          onRemoveFromCart={handleRemoveFromCart}
        />
      </div>
    </main>
  );
}
