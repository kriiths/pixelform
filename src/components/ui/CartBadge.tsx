interface CartBadgeProps {
  count: number;
  testId?: string;
  variant?: 'header' | 'mobile';
}

export function CartBadge({ count, testId, variant = 'header' }: CartBadgeProps) {
  const isZero = count === 0;
  const styles = variant === 'header'
    ? `absolute -top-1 -right-1 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md border-2 border-white ${isZero ? 'bg-transparent text-transparent border-transparent' : 'bg-pixel text-white border-white'}`
    : `text-xs px-2 py-1 rounded-full ${isZero ? 'bg-transparent text-transparent' : 'bg-pixel text-white'}`;

  return (
    <span className={styles} data-testid={testId} aria-hidden={isZero ? 'true' : undefined}>
      {isZero ? '' : count}
    </span>
  );
}
