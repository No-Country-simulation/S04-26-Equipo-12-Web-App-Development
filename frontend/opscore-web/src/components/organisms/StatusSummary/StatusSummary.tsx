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
  critical: 'bg-badge-critical/15 text-badge-critical ring-2 ring-badge-critical/40',
  warning: 'bg-badge-warning/15 text-badge-warning ring-2 ring-badge-warning/40',
  resolved: 'bg-badge-resolved/15 text-badge-resolved ring-2 ring-badge-resolved/40',
  'in-progress': 'bg-badge-in-progress/15 text-badge-in-progress ring-2 ring-badge-in-progress/40',
  neutral: 'bg-surface-background text-surface-foreground ring-2 ring-surface-foreground/40',
}

export function StatusSummary({ statuses, className }: StatusSummaryProps) {
  return (
    <div className={cn('flex gap-2', className)}>
      {statuses.map((s) => (
        <div
          key={s.label}
          className={cn('flex flex-1 items-center gap-3 rounded px-4 py-2 text-sm font-semibold', variantBg[s.variant])}
        >
          <span className="text-xs uppercase tracking-wide">{s.label}</span>
          <span className="text-base font-bold">{s.count}</span>
        </div>
      ))}
    </div>
  )
}
