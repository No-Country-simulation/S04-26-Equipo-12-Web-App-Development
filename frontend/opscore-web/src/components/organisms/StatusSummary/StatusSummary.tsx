import { cn } from '@/utils/cn'
import type { BadgeVariant } from '@/types'

interface StatusCount {
  variant: BadgeVariant
  label: string
  count: number
}

interface StatusSummaryProps {
  statuses: StatusCount[]
  className?: string
}

const variantBg: Record<BadgeVariant, string> = {
  critical: 'bg-badge-critical/15 text-badge-critical',
  warning: 'bg-badge-warning/15 text-badge-warning',
  resolved: 'bg-badge-resolved/15 text-badge-resolved',
  'in-progress': 'bg-badge-in-progress/15 text-badge-in-progress',
  neutral: 'bg-surface-background text-surface-foreground',
}

export function StatusSummary({ statuses, className }: StatusSummaryProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {statuses.map((s) => (
        <div
          key={s.label}
          className={cn('flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-semibold', variantBg[s.variant])}
        >
          <span className="text-xs uppercase tracking-wide">{s.label}</span>
          <span className="text-base font-bold">{s.count}</span>
        </div>
      ))}
    </div>
  )
}
