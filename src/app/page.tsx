import Link from 'next/link';
import { texts } from './content/texts';
import { Button } from '@/components/ui/Button';
import { testIds } from '@/lib/testids';
import { paths } from '@/lib/paths';
import { HeroSection } from '@/components/home/HeroSection';
import { CategoryCard } from '@/components/home/CategoryCard';
import { NewsSection } from '@/components/home/NewsSection';

export default function Home() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-20 bg-offwhite min-h-[80vh]">
      <HeroSection />

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        <CategoryCard category="pixelparla" testId={testIds.categoryCardPixelparla} />
        <CategoryCard category="resin" testId={testIds.categoryCardResin} />
        <CategoryCard category="junior" testId={testIds.categoryCardJunior} />
      </section>

      <div className="flex flex-wrap justify-center gap-6 mb-20">
        <Link href={paths.shop}>
          <Button variant="primary" accentColor="black" className="px-10 py-4 text-xl">
            {texts.home.cta.shop}
          </Button>
        </Link>
      </div>

      <NewsSection />
    </main>
  );
}
