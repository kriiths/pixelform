interface CartBadgeProps {
  count: number;
  testId?: string;
  variant?: 'header' | 'mobile';
}

export function CartBadge({ count, testId, variant = 'header' }: CartBadgeProps) {
  if (count === 0) return null;

  const styles = variant === 'header'
    ? 'absolute -top-1 -right-1 bg-pixel text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md border-2 border-white'
    : 'bg-pixel text-white text-xs px-2 py-1 rounded-full';

  return (
    <span className={styles} data-testid={testId}>
      {count}
    </span>
  );
}
