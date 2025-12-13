"use client";

import { products } from '../../data/index';
import Image from 'next/image';
import { useCart } from '@/app/cart/context';
import { texts } from '@/app/content/texts';
import { use, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { CATEGORY_ACCENT, type Category } from '@/lib/types';

interface Props {
  params: Promise<{ category: string; productId: string }>;
}

export default function ProductPage({ params }: Props) {
  const { category, productId } = use(params);
  const { addItem } = useCart();

  // Image gallery state (must be before any early return)
  const [imgIdx, setImgIdx] = useState<number>(0);

  const productList = products[category as keyof typeof products];
  const product = productList?.find((p) => p.id === parseInt(productId));

  if (!product) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-24">
        <p className="text-lg text-neutral-700 mb-6">{texts.product.notFound}</p>
        <Link href="/shop" className="text-blue-600 hover:underline">
          {texts.cart.continueShopping}
        </Link>
      </main>
    );
  }

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
    });
  };

  const handleNext = () => setImgIdx((prev) => (prev + 1) % images.length);
  const handlePrev = () => setImgIdx((prev) => (prev - 1 + images.length) % images.length);

  return (
    <main className="max-w-4xl mx-auto px-4 py-16 bg-offwhite min-h-[80vh]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div className="bg-white rounded-xl border border-gray-light p-10 flex flex-col items-center justify-center shadow-subtle">
          <div className="relative w-full flex items-center justify-center">
            <button
              onClick={handlePrev}
              aria-label={texts.product.prevImage}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-white z-10"
              style={{ display: images.length > 1 ? 'block' : 'none' }}
            >
              {texts.product.prevArrow}
            </button>
            <Image
              src={images[imgIdx]}
              alt={product.name}
              width={400}
              height={400}
              className="object-contain rounded-xl"
            />
            <button
              onClick={handleNext}
              aria-label={texts.product.nextImage}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-white z-10"
              style={{ display: images.length > 1 ? 'block' : 'none' }}
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
                  className={`w-3 h-3 rounded-full border ${imgIdx === idx ? 'bg-black' : 'bg-gray-light'}`}
                  aria-label={`${texts.product.selectImage} ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col items-start bg-offwhite p-0 md:p-4 rounded-xl">
          <h1 className="text-4xl font-extrabold mb-4 text-black leading-tight">{product.name}</h1>
          <p className="text-xl font-semibold mb-6 text-gray">{product.price}</p>
          <p className="text-gray-700 mb-10 text-lg leading-relaxed">{product.description}</p>
          <Button
            onClick={handleAddToCart}
            variant="accent"
            accentColor={CATEGORY_ACCENT[category as Category]}
            className="px-8 py-4 text-lg"
          >
            {texts.product.addToCart}
          </Button>
          <Link href="/shop" className="mt-8 text-resin hover:underline text-base font-medium">
            {texts.product.backArrow} {texts.product.backToShop}
          </Link>
        </div>
      </div>
    </main>
  );
}