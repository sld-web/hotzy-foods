import { cn } from './utils';
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ className, label, error, id, ...props }: InputProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-label-sm text-on-surface-variant">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          'w-full px-3 py-2.5 rounded-lg border border-outline-variant bg-white text-body-md text-on-surface',
          'placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary',
          'transition-colors outline-none',
          error && 'border-error focus:border-error focus:ring-error',
          className,
        )}
        {...props}
      />
      {error && <p className="text-label-sm text-error">{error}</p>}
    </div>
  );
}
