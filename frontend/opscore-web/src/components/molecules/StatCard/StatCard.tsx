import { type LucideIcon } from 'lucide-react'
import { cn } from '@/utils/cn'

type StatTrend = 'up' | 'down' | 'neutral'
type BadgeVariant = 'critical' | 'warning' | 'resolved' | 'in-progress' | 'neutral'

interface StatCardProps {
  title: string
  value: string | number
  icon?: LucideIcon
  delta?: string
  trend?: StatTrend
  alert?: boolean
  badgeVariant?: BadgeVariant
  className?: string
}

const trendStyles: Record<StatTrend, string> = {
  up: 'text-badge-resolved',
  down: 'text-badge-critical',
  neutral: 'text-surface-foreground',
}

export function StatCard({ title, value, icon: Icon, delta, trend = 'neutral', alert = false, badgeVariant = 'neutral', className }: StatCardProps) {
  return (
    <div className={cn('flex flex-col gap-2 rounded bg-surface-background ring-2 ring-outline-variant p-4', alert && 'ring-badge-critical/40', className)}>
      <div className={cn("flex items-center justify-between text-surface-foreground", badgeVariant !== 'neutral' && `text-badge-${badgeVariant}`)}>
        <span className="text-xs font-semibold uppercase tracking-wide">{title}</span>
        {Icon && <Icon size={16} />}
      </div>
      <p className={cn('text-3xl font-bold leading-none', alert ? 'text-badge-critical' : 'text-foreground')}>
        {value}
      </p>
      {delta && <p className={cn('text-xs font-medium', trendStyles[trend])}>{delta}</p>}
    </div>
  )
}
