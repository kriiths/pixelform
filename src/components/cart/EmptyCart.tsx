import { texts } from '@/app/content/texts';
import { paths } from '@/lib/paths';
import { PageContainer } from '@/components/ui/PageContainer';
import { LinkButton } from '@/components/ui/LinkButton';

export function EmptyCart() {
  return (
    <PageContainer spacing="spacious">
      <h1 className="text-3xl font-semibold mb-6 text-neutral-900">
        {texts.cart.title}
      </h1>
      <p className="text-lg text-neutral-700 mb-6">
        {texts.cart.empty}
      </p>
      <LinkButton href={paths.shop}>
        {texts.cart.continueShopping}
      </LinkButton>
    </PageContainer>
  );
}
