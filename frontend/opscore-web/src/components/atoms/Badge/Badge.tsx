import { cn } from '../../../utils/cn'

type BadgeVariant = 'critical' | 'warning' | 'resolved' | 'in-progress' | 'neutral'
type BadgeSize = 'sm' | 'md'

interface BadgeProps {
  variant: BadgeVariant
  size?: BadgeSize
  label: string
  dot?: boolean
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  critical: 'bg-badge-critical/15 text-badge-critical',
  warning: 'bg-badge-warning/15 text-badge-warning',
  resolved: 'bg-badge-resolved/15 text-badge-resolved',
  'in-progress': 'bg-badge-in-progress/15 text-badge-in-progress',
  neutral: 'bg-surface-background text-surface-foreground',
}

const dotStyles: Record<BadgeVariant, string> = {
  critical: 'bg-badge-critical',
  warning: 'bg-badge-warning',
  resolved: 'bg-badge-resolved',
  'in-progress': 'bg-badge-in-progress',
  neutral: 'bg-surface-foreground',
}

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs gap-1',
  md: 'px-2.5 py-1 text-xs gap-1.5',
}

export function Badge({ variant, size = 'md', label, dot = true, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-semibold uppercase tracking-wide',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
    >
      {dot && <span className={cn('size-1.5 rounded-full', dotStyles[variant])} />}
      {label}
    </span>
  )
}
