import { useState } from 'react'
import { DashboardLayout } from '@/components/templates'
import {
  ExportBar,
  IncidentsByAreaChart,
  MetricsSummary,
  ReportFilterBar,
  RootCausesChart,
  exportToExcel,
  exportToPDF,
  useReportMetrics,
} from '@/features/reports'
import { useAuthStore } from '@/store'
import type { ReportFilters, UserRole } from '@/types'

export const ReportPage = () => {
  const pageTitle = 'Reportes'
  const [filters, setFilters] = useState<ReportFilters>({})
  const role = useAuthStore((state) => state.user?.role ?? 'MANAGER')
  const { metrics, incidents, isLoading, isError } = useReportMetrics(filters)

  const roleLabelByUserRole: Record<UserRole, string> = {
    OPERATOR: 'Operador',
    SUPERVISOR: 'Supervisor',
    MANAGER: 'Manager',
    ADMIN: 'Admin',
  }

  const handleExportExcel = () => {
    exportToExcel(incidents)
  }

  const handleExportPDF = () => {
    if (!metrics) return
    exportToPDF(metrics, filters)
  }

  return (
    <DashboardLayout pageTitle={pageTitle}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-foreground">Reportes</h2>
          <ExportBar onExportExcel={handleExportExcel} onExportPDF={handleExportPDF} />
        </div>

        <ReportFilterBar filters={filters} onChange={setFilters} />

        {isLoading && (
          <div className="rounded bg-surface-background p-6 text-sm text-surface-foreground ring-2 ring-outline-variant">
            Cargando...
          </div>
        )}

        {isError && (
          <div className="rounded bg-surface-background p-6 text-sm text-badge-critical ring-2 ring-outline-variant">
            Error al cargar los datos
          </div>
        )}

        {!isLoading && !isError && !metrics && (
          <div className="rounded bg-surface-background p-6 text-sm text-surface-foreground ring-2 ring-outline-variant">
            Sin datos para el período seleccionado
          </div>
        )}

        {!isLoading && !isError && metrics && (
          <>
            <MetricsSummary metrics={metrics} role={role} />

            {(role === 'MANAGER' || role === 'ADMIN') && (
              <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <IncidentsByAreaChart data={metrics.incidentsByArea} />
                <RootCausesChart data={metrics.rootCauses} />
              </section>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
