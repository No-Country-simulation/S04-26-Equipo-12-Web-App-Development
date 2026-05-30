import { DashboardLayout } from "@/components/templates"
import { IncidentTable } from '@/components/organisms'
import type { IncidentRowData } from '@/components/molecules'

export const IncidentPage = () => {
  const pageTitle = 'Incidentes'

  const incidents: IncidentRowData[] = [
    {
      id: 'INC-8492',
      date: '2023-10-27 14:32',
      description: 'Fallo en bomba principal en sector de proceso. Requiere inspección inmediata.',
      location: 'Planta Sur - L2',
      operator: 'J. Ramirez',
      status: 'critical',
      statusLabel: 'Crítica',
    },
    {
      id: 'INC-8491',
      date: '2023-10-27 11:15',
      description: 'Mantenimiento preventivo programado en sistema de ventilación.',
      location: 'Edificio Central - PB',
      operator: 'M. Gomez',
      status: 'in-progress',
      statusLabel: 'En Curso',
    },
    {
      id: 'INC-8488',
      date: '2023-10-26 09:00',
      description: 'Actualización de firmware en controladores de campo.',
      location: 'Tubería Norte',
      operator: 'A. Silva',
      status: 'resolved',
      statusLabel: 'Cerrada',
    },
  ]

  return (
    <DashboardLayout pageTitle={pageTitle}>
      <div className="flex flex-col gap-6">
        <div className="rounded-xl border border-outline-variant bg-surface-background p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Panel de Incidencias</h2>
              <p className="mt-1 text-sm text-surface-foreground/80">Gestión y seguimiento de eventos operativos en tiempo real.</p>
            </div>

            <div className="flex items-center gap-3">
              <button className="px-3 py-2 rounded-md border border-outline-variant text-sm text-surface-foreground bg-transparent hover:bg-surface-hover">Exportar</button>
              <button className="px-4 py-2 rounded-md bg-primary text-white text-sm hover:opacity-95">+ Nuevo Reporte</button>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-surface-hover text-sm text-surface-foreground">Filtros Activos</span>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-surface-hover text-sm text-surface-foreground">Área: Todas</span>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-surface-hover text-sm text-surface-foreground">Prioridad: Todas</span>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-surface-hover text-sm text-surface-foreground">Estado: Todos</span>
            </div>

            <button className="text-sm text-primary hover:underline">Limpiar Filtros</button>
          </div>

          <div className="mt-6">
            <IncidentTable incidents={incidents} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}