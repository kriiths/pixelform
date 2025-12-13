import ProductCard from '@/components/product/ProductCard';
import { junior } from '../data/junior';
import { texts } from '../../content/texts';

export default function JuniorShop() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold mb-2 text-neutral-900">{texts.junior.title}</h1>
      <p className="mb-8 text-lg text-neutral-700">{texts.junior.description}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {junior.map((product) => (
          <ProductCard 
            key={product.id} 
            {...product} 
            category="junior" 
          />
        ))}
      </div>
    </main>
  );
}
