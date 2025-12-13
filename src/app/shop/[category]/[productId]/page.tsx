"use client";

import { products } from '../../data/index';
import Image from 'next/image';
import { useCart } from '../../../cart/context';
import { texts } from '../../../content/texts';
import { use, useState } from 'react';
import Link from 'next/link';

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
    <main className="max-w-4xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-neutral-50 rounded-lg p-8 flex flex-col items-center justify-center">
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
              className="object-contain rounded"
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
                  className={`w-3 h-3 rounded-full border ${imgIdx === idx ? 'bg-neutral-900' : 'bg-neutral-300'}`}
                  aria-label={`${texts.product.selectImage} ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <h1 className="text-3xl font-semibold mb-4 text-neutral-900">{product.name}</h1>
          <p className="text-2xl font-medium mb-6 text-neutral-900">{product.price}</p>
          <p className="text-neutral-700 mb-8">{product.desc}</p>
          <button
            onClick={handleAddToCart}
            className="bg-neutral-900 text-white px-8 py-3 rounded hover:bg-neutral-700 transition w-full md:w-auto"
          >
            {texts.product.addToCart}
          </button>
          <Link href="/shop" className="mt-6 text-blue-600 hover:underline text-sm">
            ← {texts.product.backToShop}
          </Link>
        </div>
      </div>
    </main>
  );
}