import Link from 'next/link';
import Image from 'next/image';

interface ProductCardProps {
  id: number;
  name: string;
  desc: string;
  price: string;
  image: string;
  category: string;
}

export default function ProductCard({ id, name, desc, price, image, category }: ProductCardProps) {
  // Accent color per category
  const accent = category === 'pixelparla' ? 'pixel' : category === 'resin' ? 'resin' : 'black';
  const accentColors: { [key: string]: string } = {
    pixel: '#E94F64',
    resin: '#4F7FE9',
    black: '#111',
  };
  return (
    <Link href={`/shop/${category}/${id}`}>
      <div
        className={
          `bg-white border border-gray-light rounded-xl p-6 hover:shadow-subtle transition-all duration-200 cursor-pointer group flex flex-col h-full`
        }
        style={{ borderTop: `4px solid ${accentColors[accent] || '#111'}` }}
      >
        <div className="relative h-48 mb-5 bg-offwhite rounded-lg overflow-hidden flex items-center justify-center">
          <Image
            src={image}
            alt={name}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-200"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <h3 
          className="text-lg font-bold mb-2"
          style={{ color: accentColors[accent] }}
        >
          {name}
        </h3>
        <p className="text-sm text-gray mb-4 flex-1">{desc}</p>
        <p className="text-lg font-semibold text-black">{price}</p>
      </div>
    </Link>
  );
}
