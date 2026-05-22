import { Button } from '@/components/atoms'
import { cn } from '@/utils/cn'
import type { BadgeVariant } from '@/types'

export interface HighPriorityItem {
  id: string
  time: string
  title: string
  sector: string
  variant: BadgeVariant
}

interface HighPriorityFeedProps {
  items: HighPriorityItem[]
  onViewAll?: () => void
  className?: string
}

const sectorDotStyles: Record<BadgeVariant, string> = {
  critical: 'bg-badge-critical',
  warning: 'bg-badge-warning',
  resolved: 'bg-badge-resolved',
  'in-progress': 'bg-badge-in-progress',
  neutral: 'bg-surface-foreground',
}

export function HighPriorityFeed({ items, onViewAll, className }: HighPriorityFeedProps) {
  return (
    <div className={cn('rounded bg-surface-background flex flex-col ring-2 ring-outline-variant', className)}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant">
        <h3 className="text-sm font-semibold text-foreground">Alta Prioridad</h3>
        <div className="bg-surface-foreground/20 px-2 py-0.5 rounded">
          <span className="text-xs text-foreground">Recientes</span>
        </div>
      </div>

      <ul className="flex-1 divide-y divide-outline-variant">
        {items.map((item) => (
          <li key={item.id} className="flex items-start gap-3 px-4 py-3">
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center gap-2 mb-0.5">
                <span className="text-[11px] text-surface-foreground font-mono">{item.id}</span>
                <span className="text-[11px] text-surface-foreground whitespace-nowrap">{item.time}</span>
              </div>
              <p className="text-sm text-foreground font-medium truncate">{item.title}</p>
              <span className="inline-flex items-center gap-1 text-[11px] text-surface-foreground mt-0.5">
                <span className={cn('size-1.5 rounded-full', sectorDotStyles[item.variant])} />
                {item.sector}
              </span>
            </div>
          </li>
        ))}
      </ul>

      {onViewAll && (
        <div className="px-2 py-1.5 border-t border-outline-variant">
          <div className="w-full border border-outline-variant rounded">
            <Button variant="ghost" size="sm" fullWidth onClick={onViewAll}>
              VER TODAS
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
