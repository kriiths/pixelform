import Link from 'next/link';
import { paths } from '@/lib/paths';
import { texts } from '@/app/content/texts';

type CategoryType = 'pixelparla' | 'resin' | 'junior';

interface CategoryCardProps {
  category: CategoryType;
  testId?: string;
}

interface CategoryConfig {
  href: string;
  title: string;
  description: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
}

const categoryConfigs: Record<CategoryType, CategoryConfig> = {
  pixelparla: {
    href: paths.pixelParla,
    title: texts.shop.categories.pixelparla,
    description: texts.home.categories.pixelparlaDesc,
    bgClass: 'bg-pixel/10',
    borderClass: 'border-pixel/20',
    textClass: 'text-pixel',
  },
  resin: {
    href: paths.resin,
    title: texts.shop.categories.resin,
    description: texts.home.categories.resinDesc,
    bgClass: 'bg-resin/10',
    borderClass: 'border-resin/20',
    textClass: 'text-resin',
  },
  junior: {
    href: paths.junior,
    title: texts.shop.categories.junior,
    description: texts.home.categories.juniorDesc,
    bgClass: 'bg-gray-light',
    borderClass: 'border-gray',
    textClass: 'text-black',
  },
};

export function CategoryCard({ category, testId }: CategoryCardProps) {
  const config = categoryConfigs[category];

  return (
    <Link href={config.href} className="group block" data-testid={testId}>
      <div className={`rounded-xl p-8 h-56 flex flex-col items-center justify-center hover:shadow-subtle transition-all ${config.bgClass} border ${config.borderClass}`}>
        <h2 className={`text-2xl font-bold mb-3 ${config.textClass} group-hover:scale-105 transition-transform`}>
          {config.title}
        </h2>
        <p className="text-gray-700 text-center text-sm">{config.description}</p>
      </div>
    </Link>
  );
}
