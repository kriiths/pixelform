import Image from 'next/image';
import { useState } from 'react';
import { texts } from '@/app/content/texts';
import { testIds } from '@/lib/testids';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [imgIdx, setImgIdx] = useState<number>(0);
  const hasMultipleImages = images.length > 1;

  const handleNext = () => setImgIdx((prev) => (prev + 1) % images.length);
  const handlePrev = () => setImgIdx((prev) => (prev - 1 + images.length) % images.length);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!hasMultipleImages) return;
    if (e.key === 'ArrowLeft') handlePrev();
    if (e.key === 'ArrowRight') handleNext();
  };

  const arrowButtonStyles = 'absolute top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-white z-10 focus:outline-none focus:ring-2 focus:ring-pixel';

  return (
    <div
      className="bg-white rounded-xl border border-gray-light p-10 flex flex-col items-center justify-center shadow-subtle"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label={texts.product.selectImage}
    >
      <div className="relative w-full h-[400px] flex items-center justify-center">
        {hasMultipleImages && (
          <button
            onClick={handlePrev}
            aria-label={texts.product.prevImage}
            className={`${arrowButtonStyles} left-0`}
            data-testid={testIds.prevImageButton}
          >
            {texts.product.prevArrow}
          </button>
        )}
        <div className="relative w-full h-full">
          <Image
            src={images[imgIdx]}
            alt={productName}
            fill
            className="object-contain rounded-xl"
            sizes="(max-width: 768px) 100vw, 400px"
            priority
          />
        </div>
        {hasMultipleImages && (
          <button
            onClick={handleNext}
            aria-label={texts.product.nextImage}
            className={`${arrowButtonStyles} right-0`}
            data-testid={testIds.nextImageButton}
          >
            {texts.product.nextArrow}
          </button>
        )}
      </div>
      {hasMultipleImages && (
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
  );
}
