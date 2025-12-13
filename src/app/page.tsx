import Link from 'next/link';
import { texts } from './content/texts';

export default function Home() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-3 text-neutral-900">{texts.home.hero.title}</h1>
        <p className="text-xl italic mb-6 text-neutral-600">{texts.home.hero.tagline}</p>
        <p className="text-lg leading-relaxed max-w-2xl mx-auto text-neutral-700">
          {texts.home.hero.description}
        </p>
      </section>

      {/* CTA Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-16">
        <Link
          href="/shop"
          className="bg-neutral-900 text-white px-8 py-3 rounded hover:bg-neutral-700 transition text-lg font-medium"
        >
          {texts.home.cta.shop}
        </Link>
      </div>

      {/* Product Categories Preview */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <Link href="/shop" className="group">
          <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-lg p-8 h-64 flex flex-col items-center justify-center hover:shadow-lg transition-all">
            <h2 className="text-3xl font-semibold mb-3 text-neutral-900 group-hover:scale-105 transition-transform">
              {texts.shop.categories.pixelparla}
            </h2>
            <p className="text-neutral-700 text-center">{texts.home.categories.pixelparlaDesc}</p>
          </div>
        </Link>
        <Link href="/shop" className="group">
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg p-8 h-64 flex flex-col items-center justify-center hover:shadow-lg transition-all">
            <h2 className="text-3xl font-semibold mb-3 text-neutral-900 group-hover:scale-105 transition-transform">
              {texts.shop.categories.resin}
            </h2>
            <p className="text-neutral-700 text-center">{texts.home.categories.resinDesc}</p>
          </div>
        </Link>
      </section>

      {/* Kampanj/Nyheter Placeholder */}
      <section className="bg-neutral-100 border border-neutral-200 rounded-lg p-8 text-center">
        <h3 className="text-2xl font-semibold mb-3 text-neutral-900">{texts.home.news.title}</h3>
        <p className="text-neutral-700 mb-4">
          {texts.home.news.description}
        </p>
        <Link href="/shop" className="text-blue-600 hover:underline font-medium">
          {texts.home.news.link}
        </Link>
      </section>
    </main>
  );
}
