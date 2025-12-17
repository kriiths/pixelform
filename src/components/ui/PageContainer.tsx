import { ReactNode } from 'react';

type Spacing = 'default' | 'spacious';

interface PageContainerProps {
  children: ReactNode;
  spacing?: Spacing;
}

const spacingStyles: Record<Spacing, string> = {
  default: 'py-12',
  spacious: 'py-24',
};

export function PageContainer({ children, spacing = 'default' }: PageContainerProps) {
  return (
    <main className={`max-w-4xl mx-auto px-6 ${spacingStyles[spacing]}`}>
      {children}
    </main>
  );
}
