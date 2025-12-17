import { texts } from '@/app/content/texts';
import { paths } from '@/lib/paths';
import { PageContainer } from '@/components/ui/PageContainer';
import { Panel } from '@/components/ui/Panel';
import { LinkButton } from '@/components/ui/LinkButton';

interface OrderConfirmationProps {
  orderNumber: string;
}

export function OrderConfirmation({ orderNumber }: OrderConfirmationProps) {
  return (
    <PageContainer spacing="spacious">
      <Panel variant="success" className="p-8 text-center">
        <div className="text-5xl mb-4">✓</div>
        <h1 className="text-3xl font-semibold mb-4 text-neutral-900">
          {texts.checkout.thankYou}
        </h1>
        <p className="text-lg text-neutral-700 mb-2">
          {texts.checkout.orderNumber}: <span className="font-mono font-semibold">{orderNumber}</span>
        </p>
        <p className="text-neutral-600 mb-8">
          {texts.checkout.confirmationSent}
        </p>
        <LinkButton href={paths.shop} variant="filled" className="px-8">
          {texts.checkout.backToShop}
        </LinkButton>
      </Panel>
    </PageContainer>
  );
}
