import { ButtonHTMLAttributes, ReactNode } from 'react';
import { ACCENT_COLORS, type AccentColor } from '@/lib/types';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'accent';
  accentColor?: AccentColor;
  fullWidth?: boolean;
}

export function Button({ 
  children, 
  variant = 'primary', 
  accentColor = 'black',
  fullWidth = false,
  className = '',
  ...props 
}: ButtonProps) {
  const baseStyles = 'px-6 py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantStyles = {
    primary: 'text-white shadow-subtle hover:opacity-90',
    secondary: 'bg-white border-2 hover:bg-neutral-50',
    accent: 'text-white shadow-subtle hover:opacity-90',
  };

  const widthStyle = fullWidth ? 'w-full' : '';
  
  const style: React.CSSProperties = {};
  
  if (variant === 'primary' || variant === 'accent') {
    style.backgroundColor = ACCENT_COLORS[accentColor];
  }
  
  if (variant === 'secondary') {
    style.borderColor = ACCENT_COLORS[accentColor];
    style.color = ACCENT_COLORS[accentColor];
  }

  return (
    <button 
      className={`${baseStyles} ${variantStyles[variant]} ${widthStyle} ${className}`}
      style={style}
      {...props}
    >
      {children}
    </button>
  );
}
