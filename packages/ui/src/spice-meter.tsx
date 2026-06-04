import { cn } from './utils';

interface SpiceMeterProps {
  level: 1 | 2 | 3 | 4;
  className?: string;
}

const levelColors = {
  1: ['text-golden-glaze', 'text-surface', 'text-surface', 'text-surface'],
  2: ['text-golden-glaze', 'text-chili-red', 'text-surface', 'text-surface'],
  3: ['text-golden-glaze', 'text-chili-red', 'text-primary', 'text-surface'],
  4: ['text-golden-glaze', 'text-chili-red', 'text-primary', 'text-[#92001f]'],
};

const levelLabels = {
  1: 'Mild',
  2: 'Medium',
  3: 'Hot',
  4: 'Xtreme',
};

export function SpiceMeter({ level, className }: SpiceMeterProps) {
  return (
    <div className={cn('flex items-center gap-0.5', className)} title={`Spice Level: ${levelLabels[level]}`}>
      {[1, 2, 3, 4].map((i) => (
        <span key={i} className={cn('material-symbols-outlined text-base', levelColors[level][i - 1])}>
          local_fire_department
        </span>
      ))}
      <span className="text-label-sm text-on-surface-variant ml-1">{levelLabels[level]}</span>
    </div>
  );
}
