import { ReactNode } from 'react';

interface SectionHeadingProps {
  children: ReactNode;
  size?: 'lg' | 'xl' | '2xl' | '3xl';
  className?: string;
}

const sizeStyles = {
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
};

export function SectionHeading({ children, size = '2xl', className = '' }: SectionHeadingProps) {
  return (
    <h2 className={`font-semibold text-neutral-900 ${sizeStyles[size]} ${className}`}>
      {children}
    </h2>
  );
}
