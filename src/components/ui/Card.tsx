import { ReactNode } from 'react';
import { ACCENT_COLORS, type AccentColor } from '@/lib/types';

interface CardProps {
  children: ReactNode;
  accent?: AccentColor;
  className?: string;
}

export function Card({ children, accent = 'black', className = '' }: CardProps) {
  return (
    <div 
      className={`bg-white border border-gray-light rounded-xl p-6 hover:shadow-subtle transition-all duration-200 ${className}`}
      style={{ borderTop: `4px solid ${ACCENT_COLORS[accent]}` }}
    >
      {children}
    </div>
  );
}
