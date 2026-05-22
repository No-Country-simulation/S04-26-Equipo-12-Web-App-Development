import { MoreVertical } from 'lucide-react'
import { cn } from '@/utils/cn'

export interface TrendDataPoint {
  label: string
  critical: number
  medium: number
  onProgress: number
  resolved: number
}

interface TrendChartProps {
  data: TrendDataPoint[]
  title?: string
  className?: string
}

export function TrendChart({ data, title = 'Tendencia por Turno', className }: TrendChartProps) {
  const maxValue = Math.max(...data.map((d) => d.critical + d.medium + d.onProgress + d.resolved))

  return (
    <div className={cn('rounded bg-surface-background ring-2 ring-outline-variant p-4 flex flex-col gap-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <button className="text-surface-foreground hover:text-foreground transition-colors" aria-label="Opciones">
          <MoreVertical size={16} />
        </button>
      </div>

      <div className="flex items-end gap-2 h-40">
        {data.map((point) => {
          const criticalPct = (point.critical / maxValue) * 100
          const mediumPct = (point.medium / maxValue) * 100
          const onProgressPct = (point.onProgress / maxValue) * 100
          const resolvedPct = (point.resolved / maxValue) * 100

          return (
            <div key={point.label} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col justify-end gap-0.5" style={{ height: '100%' }}>
                <div title={`Crítica: ${point.critical}`} className="w-full rounded-t bg-badge-critical transition-all" style={{ height: `${criticalPct}%` }} />
                <div title={`Media: ${point.medium}`} className="w-full bg-badge-warning transition-all" style={{ height: `${mediumPct}%` }} />
                <div title={`En progreso: ${point.onProgress}`} className="w-full bg-badge-in-progress transition-all" style={{ height: `${onProgressPct}%` }} />
                <div title={`Resuelta: ${point.resolved}`} className="w-full bg-badge-resolved transition-all" style={{ height: `${resolvedPct}%` }} />
              </div>
              <span className="text-xs text-surface-foreground">{point.label}</span>
            </div>
          )
        })}
      </div>

      <div className="flex gap-4 text-xs text-surface-foreground">
        <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-badge-critical" /> Crítica</span>
        <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-badge-warning" /> Media</span>
        <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-badge-in-progress" /> En progreso</span>
        <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-badge-resolved" /> Resuelta</span>
      </div>
    </div>
  )
}
