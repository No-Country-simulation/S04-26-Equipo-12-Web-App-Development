import { StatCard } from '@/components/molecules/StatCard'
import { CheckCircle, AlertCircle, TriangleAlert, Clock } from 'lucide-react'


const statsData = [
  { title: 'Incidentes Resueltos', value: 120, delta: '+15%', trend: 'up', icon: CheckCircle, badgeVariant: 'resolved' },
  { title: 'Criticas activas', value: 3, delta: 'Requiere atención inmediata', trend: 'down', icon: TriangleAlert, alert: true, badgeVariant: 'critical' },
  { title: 'Tiempo Promedio de Resolución', value: '2h 30m', delta: '0%', trend: 'neutral', icon: Clock, badgeVariant: 'neutral' },
] as const

export const StatsGroup = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {statsData.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  )
}