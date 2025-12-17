import { getProductById } from '../../data/loader';
import { texts } from '@/app/content/texts';
import Link from 'next/link';
import ProductPageClient from './ProductPageClient';

interface Props {
  params: Promise<{ category: string; productId: string }>;
}

export default async function ProductPage({ params }: Props) {
  const { category, productId } = await params;
  
  // Load product dynamically from file system
  const product = await getProductById(category, productId);

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

  return <ProductPageClient product={product} category={category} />;
}