import { cn } from './utils';

interface FilterChipsProps {
  options: { value: string; label: string }[];
  selected: string;
  onChange: (value: string) => void;
  className?: string;
}

export function FilterChips({ options, selected, onChange, className }: FilterChipsProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            'px-3 py-1.5 rounded-full text-label-sm transition-colors',
            selected === opt.value
              ? 'bg-primary text-white'
              : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
