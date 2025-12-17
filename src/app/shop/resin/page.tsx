import ProductCard from '@/components/product/ProductCard';
import { loadProductsByCategory } from '../data/loader';
import { texts } from '../../content/texts';

export default async function ResinShop() {
  const products = await loadProductsByCategory('resin');
  
  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold mb-8 text-resin">{texts.shop.categories.resin}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} {...p} category="resin" />
        ))}
      </div>
    </main>
  );
}
