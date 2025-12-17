import { texts } from '@/app/content/texts';

interface PriceDisplayProps {
  amount: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeStyles = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg font-semibold',
  xl: 'text-2xl font-bold',
};

export function PriceDisplay({ amount, size = 'md', className = '' }: PriceDisplayProps) {
  return (
    <span className={`text-neutral-900 ${sizeStyles[size]} ${className}`}>
      {amount}{texts.currency.suffix}
    </span>
  );
}
