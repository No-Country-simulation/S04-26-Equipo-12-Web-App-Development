import { DashboardLayout } from "@/components/templates"
import { IncidentStatusSummary, StatsGroup, HighPriorityFeed, TrendChart } from "@/features/dashboard"



const mockHighPriorityItems = [
  {
    id: 'INC-12345',
    time: 'Hace 10 minutos',
    title: 'Falla crítica en el servidor de base de datos',
    sector: 'Base de Datos',
    variant: 'critical' as const,
  },
  {
    id: 'INC-12346',
    time: 'Hace 30 minutos',
    title: 'Latencia alta en el servicio de autenticación',
    sector: 'Autenticación',
    variant: 'warning' as const,
  },
  {
    id: 'INC-12347',
    time: 'Hace 1 hora',
    title: 'Error intermitente en la API de pagos',
    sector: 'Pagos',
    variant: 'in-progress' as const,
  },
  {
    id: 'INC-12348',
    time: 'Hace 2 horas',
    title: 'Incidente resuelto en el servicio de notificaciones',
    sector: 'Notificaciones',
    variant: 'resolved' as const,
  },
]

const mockTrendData = [
  { label: 'T1', critical: 5, medium: 10, onProgress: 8, resolved: 15 },
  { label: 'T2', critical: 3, medium: 12, onProgress: 6, resolved: 18 },
  { label: 'T3', critical: 4, medium: 8, onProgress: 5, resolved: 20 },
  { label: 'T4', critical: 2, medium: 15, onProgress: 7, resolved: 25 },
  { label: 'T5', critical: 6, medium: 9, onProgress: 4, resolved: 22 },
]

export const DashboardPage = () => {
  
  const pageTitle = "Dashboard de Supervisión"

  return (
    <DashboardLayout pageTitle={pageTitle}>
      <div className="flex flex-col gap-6">
        <StatsGroup />
        <div className="flex gap-4">
          <div className="flex flex-col w-full gap-6">
            <IncidentStatusSummary />
            <TrendChart data={mockTrendData} />
          </div>
          <HighPriorityFeed items={mockHighPriorityItems} onViewAll={() => console.log('Ver todas')} />
        </div>
      </div>
    </DashboardLayout>
  )
}