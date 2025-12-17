import { InputHTMLAttributes } from 'react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function FormField({ label, className = '', ...props }: FormFieldProps) {
  const inputStyles = 'w-full border border-neutral-300 rounded px-3 py-2';

  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input className={`${inputStyles} ${className}`} {...props} />
    </div>
  );
}
