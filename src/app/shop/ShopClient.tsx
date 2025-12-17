"use client";

import { useState } from 'react';
import ProductCard from '@/components/product/ProductCard';
import { texts } from '../content/texts';
import type { Product } from '@/lib/types';
import { testIds } from '@/lib/testids';
import { SelectField } from '@/components/ui/SelectField';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProductGrid } from '@/components/ui/ProductGrid';

interface Props {
  pixelparla: Product[];
  resin: Product[];
  junior: Product[];
}

const sortOptions = [
  { value: 'name', label: texts.shop.sortOptions.name },
  { value: 'priceLow', label: texts.shop.sortOptions.priceLow },
  { value: 'priceHigh', label: texts.shop.sortOptions.priceHigh },
];

export default function ShopClient({ pixelparla, resin, junior }: Props) {
  const [sortBy, setSortBy] = useState<string>('name');

  const sortProducts = (products: Product[]) => {
    return [...products].sort((a, b) => {
      switch (sortBy) {
        case 'priceLow':
          return parseInt(a.price.replace(/\D/g, ''), 10) - parseInt(b.price.replace(/\D/g, ''), 10);
        case 'priceHigh':
          return parseInt(b.price.replace(/\D/g, ''), 10) - parseInt(a.price.replace(/\D/g, ''), 10);
        case 'name':
        default:
          return a.name.localeCompare(b.name, 'sv');
      }
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-semibold text-neutral-900">{texts.shop.title}</h1>
        <SelectField
          id="sort"
          label={texts.shop.sortBy}
          options={sortOptions}
          value={sortBy}
          onChange={handleSortChange}
          testId={testIds.sortSelect}
        />
      </div>

      <section className="mb-12">
        <SectionHeading className="mb-6">{texts.shop.categories.pixelparla}</SectionHeading>
        <ProductGrid>
          {sortProducts(pixelparla).map((p) => (
            <ProductCard key={p.id} {...p} category="pixelparla" />
          ))}
        </ProductGrid>
      </section>

      <section className="mb-12">
        <SectionHeading className="mb-6">{texts.shop.categories.resin}</SectionHeading>
        <ProductGrid>
          {sortProducts(resin).map((p) => (
            <ProductCard key={p.id} {...p} category="resin" />
          ))}
        </ProductGrid>
      </section>

      <section>
        <SectionHeading className="mb-6">{texts.shop.categories.junior}</SectionHeading>
        <ProductGrid>
          {sortProducts(junior).map((p) => (
            <ProductCard key={p.id} {...p} category="junior" />
          ))}
        </ProductGrid>
      </section>
    </main>
  );
}
