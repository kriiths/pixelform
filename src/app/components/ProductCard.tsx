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
  return (
    <Link href={`/shop/${category}/${id}`}>
      <div className="bg-white border border-neutral-200 rounded-lg p-4 hover:shadow-lg transition-all duration-200 cursor-pointer group">
        <div className="relative h-48 mb-4 bg-neutral-50 rounded overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-200"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <h3 className="text-lg font-semibold mb-2 text-neutral-900">{name}</h3>
        <p className="text-sm text-neutral-600 mb-3">{desc}</p>
        <p className="text-lg font-medium text-neutral-900">{price}</p>
      </div>
    </Link>
  );
}
