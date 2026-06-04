import { cn } from './utils';

interface KpiCardProps {
  title: string;
  value: string | number;
  trend?: { value: string; positive: boolean };
  icon: string;
  className?: string;
}

export function KpiCard({ title, value, trend, icon, className }: KpiCardProps) {
  return (
    <div className={cn('bg-white rounded-xl border border-surface-container p-5', className)}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-label-sm text-on-surface-variant">{title}</span>
        <span className="material-symbols-outlined text-primary">{icon}</span>
      </div>
      <p className="text-headline-md text-on-surface mb-1">{value}</p>
      {trend && (
        <div className="flex items-center gap-1">
          <span className={cn('text-label-sm', trend.positive ? 'text-fresh-mint' : 'text-error')}>
            {trend.positive ? '↑' : '↓'} {trend.value}
          </span>
          <span className="text-label-sm text-on-surface-variant">vs last period</span>
        </div>
      )}
    </div>
  );
}
