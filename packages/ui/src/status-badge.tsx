import { cn } from './utils';

type Status = 'active' | 'scheduled' | 'expired' | 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';

const statusStyles: Record<Status, string> = {
  active: 'bg-fresh-mint/15 text-tertiary',
  scheduled: 'bg-golden-glaze/20 text-secondary',
  expired: 'bg-surface-variant text-on-surface-variant',
  pending: 'bg-error/15 text-error',
  processing: 'bg-golden-glaze/20 text-secondary',
  shipped: 'bg-primary/10 text-primary',
  completed: 'bg-fresh-mint/15 text-tertiary',
  cancelled: 'bg-surface-variant text-on-surface-variant',
};

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-label-sm capitalize',
        statusStyles[status],
        className,
      )}
    >
      {status}
    </span>
  );
}
