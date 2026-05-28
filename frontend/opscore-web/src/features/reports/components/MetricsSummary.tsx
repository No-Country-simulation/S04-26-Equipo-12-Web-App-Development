import { Clock, CircleAlert, Gauge, ShieldAlert } from 'lucide-react'
import { StatCard } from '@/components/molecules'
import type { BadgeVariant, ReportMetrics, UserRole } from '@/types'

interface MetricsSummaryProps {
  metrics: ReportMetrics
  role: UserRole
}

export const MetricsSummary = ({ metrics, role }: MetricsSummaryProps) => {
  const cards: {
    title: string
    value: string | number
    icon: typeof Clock
    badgeVariant: BadgeVariant
    alert?: boolean
  }[] = [
    {
      title: 'T. Promedio de Respuesta',
      value: `${metrics.avgResponseTime.toFixed(1)} hs`,
      icon: Clock,
      badgeVariant: 'in-progress' as const,
    },
    {
      title: 'T. Promedio de Resolución',
      value: `${metrics.avgResolutionTime.toFixed(1)} hs`,
      icon: Gauge,
      badgeVariant: 'resolved' as const,
    },
    {
      title: 'Incidentes Críticos',
      value: metrics.criticalCount,
      icon: ShieldAlert,
      alert: metrics.criticalCount > 0,
      badgeVariant: 'critical' as const,
    },
  ]

  if (role === 'MANAGER' || role === 'ADMIN') {
    cards.push({
      title: 'Tasa de Resolución',
      value: `${metrics.resolutionRate.toFixed(1)}%`,
      icon: CircleAlert,
      badgeVariant: 'warning' as const,
    })
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <StatCard
          key={card.title}
          title={card.title}
          value={card.value}
          icon={card.icon}
          alert={card.alert}
          badgeVariant={card.badgeVariant}
        />
      ))}
    </div>
  )
}
