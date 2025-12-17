import Link from 'next/link';
import { texts } from './content/texts';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-20 bg-offwhite min-h-[80vh]">
      {/* Hero Section */}
      <section className="text-center mb-20">
        <h1 className="text-6xl font-extrabold mb-4 text-black tracking-tight leading-tight">{texts.home.hero.title}</h1>
        <p className="text-2xl italic mb-8 text-gray">{texts.home.hero.tagline}</p>
        <p className="text-lg leading-relaxed max-w-2xl mx-auto text-gray-700">
          {texts.home.hero.description}
        </p>
      </section>

      {/* Product Categories Preview */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        <Link href="/shop/pixelparla" className="group block">
          <div className="rounded-xl p-8 h-56 flex flex-col items-center justify-center hover:shadow-subtle transition-all bg-pixel/10 border border-pixel/20">
            <h2 className="text-2xl font-bold mb-3 text-pixel group-hover:scale-105 transition-transform">
              {texts.shop.categories.pixelparla}
            </h2>
            <p className="text-gray-700 text-center text-sm">{texts.home.categories.pixelparlaDesc}</p>
          </div>
        </Link>
        <Link href="/shop/resin" className="group block">
          <div className="rounded-xl p-8 h-56 flex flex-col items-center justify-center hover:shadow-subtle transition-all bg-resin/10 border border-resin/20">
            <h2 className="text-2xl font-bold mb-3 text-resin group-hover:scale-105 transition-transform">
              {texts.shop.categories.resin}
            </h2>
            <p className="text-gray-700 text-center text-sm">{texts.home.categories.resinDesc}</p>
          </div>
        </Link>
        <Link href="/shop/junior" className="group block">
          <div className="rounded-xl p-8 h-56 flex flex-col items-center justify-center hover:shadow-subtle transition-all bg-gray-light border border-gray">
            <h2 className="text-2xl font-bold mb-3 text-black group-hover:scale-105 transition-transform">
              {texts.shop.categories.junior}
            </h2>
            <p className="text-gray-700 text-center text-sm">{texts.home.categories.juniorDesc}</p>
          </div>
        </Link>
      </section>

      {/* CTA Buttons */}
      <div className="flex flex-wrap justify-center gap-6 mb-20">
        <Link href="/shop">
          <Button variant="primary" accentColor="black" className="px-10 py-4 text-xl">
            {texts.home.cta.shop}
          </Button>
        </Link>
      </div>

      {/* Kampanj/Nyheter Placeholder */}
      <section className="bg-gray-light border border-gray-light rounded-xl p-10 text-center">
        <h3 className="text-2xl font-semibold mb-3 text-black">{texts.home.news.title}</h3>
        <p className="text-gray-700 mb-4">
          {texts.home.news.description}
        </p>
        <Link href="/shop" className="text-resin hover:underline font-medium">
          {texts.home.news.link}
        </Link>
      </section>
    </main>
  );
}
