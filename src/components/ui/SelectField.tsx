import { SelectHTMLAttributes } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  testId?: string;
}

export function SelectField({ label, options, testId, className = '', ...props }: SelectFieldProps) {
  const selectStyles = 'border border-neutral-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400';

  return (
    <div className="flex items-center gap-3">
      <label htmlFor={props.id} className="text-sm text-neutral-700">
        {label}
      </label>
      <select 
        className={`${selectStyles} ${className}`} 
        data-testid={testId}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
