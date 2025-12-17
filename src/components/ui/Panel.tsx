import { ReactNode } from 'react';

type PanelVariant = 'default' | 'muted' | 'success';

interface PanelProps {
  children: ReactNode;
  variant?: PanelVariant;
  className?: string;
  testId?: string;
}

const variantStyles: Record<PanelVariant, string> = {
  default: 'bg-white border-neutral-200',
  muted: 'bg-neutral-50 border-neutral-200',
  success: 'bg-green-50 border-green-200',
};

export function Panel({ children, variant = 'default', className = '', testId }: PanelProps) {
  return (
    <div
      data-testid={testId}
      className={`border rounded-lg p-6 ${variantStyles[variant]} ${className}`}
    >
      {children}
    </div>
  );
}
