import Link from 'next/link';
import { paths } from '@/lib/paths';
import { texts } from '@/app/content/texts';

export function NewsSection() {
  return (
    <section className="bg-gray-light border border-gray-light rounded-xl p-10 text-center">
      <h3 className="text-2xl font-semibold mb-3 text-black">
        {texts.home.news.title}
      </h3>
      <p className="text-gray-700 mb-4">
        {texts.home.news.description}
      </p>
      <Link href={paths.shop} className="text-resin hover:underline font-medium">
        {texts.home.news.link}
      </Link>
    </section>
  );
}
