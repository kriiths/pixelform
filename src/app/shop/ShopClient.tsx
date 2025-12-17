"use client";

import { useState } from 'react';
import ProductCard from '@/components/product/ProductCard';
import { texts } from '../content/texts';
import type { Product } from '@/lib/types';

interface Props {
  pixelparla: Product[];
  resin: Product[];
  junior: Product[];
}

export default function ShopClient({ pixelparla, resin, junior }: Props) {
  const [sortBy, setSortBy] = useState<string>('name');

  // Sort helper
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

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-semibold text-neutral-900">{texts.shop.title}</h1>
        
        <div className="flex items-center gap-3">
          <label htmlFor="sort" className="text-sm text-neutral-700">{texts.shop.sortBy}</label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-neutral-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400"
          >
            <option value="name">{texts.shop.sortOptions.name}</option>
            <option value="priceLow">{texts.shop.sortOptions.priceLow}</option>
            <option value="priceHigh">{texts.shop.sortOptions.priceHigh}</option>
          </select>
        </div>
      </div>

      {/* Pixel & Pärla */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-neutral-900">{texts.shop.categories.pixelparla}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {sortProducts(pixelparla).map((p) => (
            <ProductCard key={p.id} {...p} category="pixelparla" />
          ))}
        </div>
      </section>

      {/* Resin & Natur */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-neutral-900">{texts.shop.categories.resin}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {sortProducts(resin).map((p) => (
            <ProductCard key={p.id} {...p} category="resin" />
          ))}
        </div>
      </section>

      {/* Junior */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-neutral-900">{texts.shop.categories.junior || 'Junior'}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {sortProducts(junior).map((p) => (
            <ProductCard key={p.id} {...p} category="junior" />
          ))}
        </div>
      </section>
    </main>
  );
}
