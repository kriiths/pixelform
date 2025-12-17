"use client";

import Image from 'next/image';
import { useCart } from '@/app/cart/context';
import { texts } from '@/app/content/texts';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { CATEGORY_ACCENT, type Category } from '@/lib/types';
import type { Product } from '@/lib/types';
import { testIds } from '@/lib/testids';

interface Props {
  product: Product;
  category: string;
}

export default function ProductPageClient({ product, category }: Props) {
  const { addItem, removeItem, items } = useCart();
  const [imgIdx, setImgIdx] = useState<number>(0);

  // Find this product in cart
  const cartItem = items.find((item) => item.id === product.id && item.category === category);
  const cartQty = cartItem?.quantity || 0;

  const images: string[] =
    product.images && product.images.length > 0
      ? product.images
      : [product.image];

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category,
    }, product.stock);
  };

  const handleNext = () => setImgIdx((prev) => (prev + 1) % images.length);
  const handlePrev = () => setImgIdx((prev) => (prev - 1 + images.length) % images.length);

  // Keyboard navigation for image gallery
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (images.length <= 1) return;
    if (e.key === 'ArrowLeft') {
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-16 bg-offwhite min-h-[80vh]" data-testid={testIds.productDetailContainer}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div 
          className="bg-white rounded-xl border border-gray-light p-10 flex flex-col items-center justify-center shadow-subtle"
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="region"
          aria-label={texts.product.selectImage}
        >
          {/* Fixed height container to prevent arrow movement */}
          <div className="relative w-full h-[400px] flex items-center justify-center">
            <button
              onClick={handlePrev}
              aria-label={texts.product.prevImage}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-white z-10 focus:outline-none focus:ring-2 focus:ring-pixel"
              style={{ display: images.length > 1 ? 'block' : 'none' }}
              data-testid={testIds.prevImageButton}
            >
              {texts.product.prevArrow}
            </button>
            <div className="relative w-full h-full">
              <Image
                src={images[imgIdx]}
                alt={product.name}
                fill
                className="object-contain rounded-xl"
                sizes="(max-width: 768px) 100vw, 400px"
                priority
              />
            </div>
            <button
              onClick={handleNext}
              aria-label={texts.product.nextImage}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-white z-10 focus:outline-none focus:ring-2 focus:ring-pixel"
              style={{ display: images.length > 1 ? 'block' : 'none' }}
              data-testid={testIds.nextImageButton}
            >
              {texts.product.nextArrow}
            </button>
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 mt-4 justify-center">
              {images.map((img, idx) => (
                <button
                  key={img}
                  onClick={() => setImgIdx(idx)}
                  className={`w-3 h-3 rounded-full border ${imgIdx === idx ? 'bg-black' : 'bg-gray-light'} focus:outline-none focus:ring-2 focus:ring-pixel`}
                  aria-label={`${texts.product.selectImage} ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col items-start bg-offwhite p-0 md:p-4 rounded-xl">
          <h1 className="text-4xl font-extrabold mb-4 text-black leading-tight">{product.name}</h1>
          <p className="text-xl font-semibold mb-6 text-gray">{product.price}</p>
          <p className="text-gray-700 mb-4 text-lg leading-relaxed">{product.description}</p>
          {/* Lagerstatus */}
          <p className={`text-base font-medium mb-6 ${product.stock === 0 ? 'text-red-600' : 'text-green-700'}`}>
            {product.stock === 0 ? texts.product.outOfStock : `${texts.product.inStock} ${product.stock}`}
          </p>
          {cartQty > 0 && (
            <div className="flex items-center gap-3 mb-2">
              <p className="text-base font-medium text-blue-700">
                {`${texts.product.inCart} ${cartQty}`}
              </p>
              <button
                type="button"
                className="text-xs px-2 py-1 rounded bg-red-100 text-red-700 border border-red-200 hover:bg-red-200 transition"
                onClick={() => removeItem(product.id, category)}
                data-testid={testIds.removeFromCartButton}
              >
                {texts.product.removeFromCart}
              </button>
            </div>
          )}
          <Button
            onClick={handleAddToCart}
            variant="accent"
            accentColor={CATEGORY_ACCENT[category as Category]}
            className={`px-8 py-4 text-lg ${product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={product.stock === 0}
          >
            {texts.product.addToCart}
          </Button>
          <Link href="/shop" className="mt-8 text-resin hover:underline text-base font-medium" data-testid={testIds.backToShopLink}>
            {texts.product.backArrow} {texts.product.backToShop}
          </Link>
        </div>
      </div>
    </main>
  );
}
