import { cn } from './utils';
import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function Select({ className, label, error, options, placeholder, id, ...props }: SelectProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-label-sm text-on-surface-variant">
          {label}
        </label>
      )}
      <select
        id={id}
        className={cn(
          'w-full px-3 py-2.5 rounded-lg border border-outline-variant bg-white text-body-md text-on-surface',
          'focus:border-primary focus:ring-1 focus:ring-primary transition-colors outline-none',
          error && 'border-error',
          className,
        )}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-label-sm text-error">{error}</p>}
    </div>
  );
}
