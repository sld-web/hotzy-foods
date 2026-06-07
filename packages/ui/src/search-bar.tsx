import { cn } from './utils';
import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  className,
}: SearchBarProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 w-full rounded-xl border border-outline-variant bg-white px-3.5 py-2.5',
        'focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all',
        className,
      )}
    >
      <svg
        className="shrink-0 text-on-surface-variant"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-body-md text-on-surface placeholder:text-on-surface-variant/50 outline-none min-w-0"
      />
    </div>
  );
}
