import Image from 'next/image';

interface ProductImageProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeStyles = {
  sm: 'w-24 h-24',
  md: 'h-48',
  lg: 'h-[400px]',
};

export function ProductImage({ src, alt, size = 'md', className = '' }: ProductImageProps) {
  const containerStyles = size === 'sm' 
    ? 'relative w-24 h-24 bg-neutral-100 rounded' 
    : 'relative w-full bg-offwhite rounded-lg overflow-hidden flex items-center justify-center';

  const sizeProp = size === 'sm' ? '96px' : size === 'md' 
    ? '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw' 
    : '(max-width: 768px) 100vw, 400px';

  return (
    <div className={`${containerStyles} ${sizeStyles[size]} ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain rounded"
        sizes={sizeProp}
      />
    </div>
  );
}
