import { DashboardLayout } from "@/components/templates"
import { IncidentStatusSummary, StatsGroup } from "@/features/dashboard"
import { HighPriorityFeed } from "@/components/organisms/HighPriorityFeed"


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

export const DashboardPage = () => {
  
  const pageTitle = "Dashboard de Supervisión"

  return (
    <DashboardLayout pageTitle={pageTitle} userName="John Doe" userRole="Admin">
      <div className="flex flex-col gap-6">
        <StatsGroup />
        <div className="flex gap-4">
          <div className="flex flex-col w-full gap-6">
            <IncidentStatusSummary />
          </div>
          <HighPriorityFeed items={mockHighPriorityItems} onViewAll={() => console.log('Ver todas')} />
        </div>
      </div>
    </DashboardLayout>
  )
}