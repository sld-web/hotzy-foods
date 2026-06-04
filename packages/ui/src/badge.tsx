import { cn } from './utils';

type BadgeVariant = 'bestseller' | 'new' | 'signature' | 'combo' | 'addon' | 'vegan' | 'gluten-free' | 'no-msg';

interface BadgeProps {
  variant: BadgeVariant;
  className?: string;
  children?: string;
}

const badgeStyles: Record<BadgeVariant, string> = {
  bestseller: 'bg-golden-glaze/20 text-secondary',
  new: 'bg-fresh-mint/20 text-tertiary',
  signature: 'bg-primary/10 text-primary',
  combo: 'bg-[#FF6B35]/20 text-[#FF6B35]',
  addon: 'bg-surface-variant text-on-surface-variant',
  vegan: 'bg-fresh-mint/15 text-tertiary',
  'gluten-free': 'bg-golden-glaze/15 text-secondary',
  'no-msg': 'bg-surface-variant text-on-surface-variant',
};

const badgeLabels: Record<BadgeVariant, string> = {
  bestseller: 'Bestseller',
  new: 'New Arrival',
  signature: 'Signature Range',
  combo: 'Combo Deal',
  addon: 'Add-on',
  vegan: 'Vegan',
  'gluten-free': 'Gluten Free',
  'no-msg': 'No MSG',
};

export function Badge({ variant, className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-label-sm',
        badgeStyles[variant],
        className,
      )}
    >
      {children || badgeLabels[variant]}
    </span>
  );
}
