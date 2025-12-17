import { texts } from '@/app/content/texts';
import { testIds } from '@/lib/testids';

export function HeroSection() {
  return (
    <section className="text-center mb-20">
      <h1 
        data-testid={testIds.heroTitle} 
        className="text-6xl font-extrabold mb-4 text-black tracking-tight leading-tight"
      >
        {texts.home.hero.title}
      </h1>
      <p className="text-2xl italic mb-8 text-gray">
        {texts.home.hero.tagline}
      </p>
      <p 
        data-testid={testIds.heroDescription} 
        className="text-lg leading-relaxed max-w-2xl mx-auto text-gray-700"
      >
        {texts.home.hero.description}
      </p>
    </section>
  );
}
