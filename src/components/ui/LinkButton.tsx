import Link from 'next/link';
import { ReactNode } from 'react';

type LinkButtonVariant = 'outline' | 'filled';

interface LinkButtonProps {
  href: string;
  children: ReactNode;
  variant?: LinkButtonVariant;
  className?: string;
}

const variantStyles: Record<LinkButtonVariant, string> = {
  outline: 'border border-neutral-900 hover:bg-neutral-900 hover:text-white',
  filled: 'bg-neutral-900 text-white hover:bg-neutral-700 rounded',
};

export function LinkButton({ href, children, variant = 'outline', className = '' }: LinkButtonProps) {
  const baseStyles = 'inline-block px-6 py-3 transition';
  
  return (
    <Link href={href} className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </Link>
  );
}
