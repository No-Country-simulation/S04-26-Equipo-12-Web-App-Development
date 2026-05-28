import { jsPDF } from 'jspdf'
import * as XLSX from 'xlsx'
import type { Incident, ReportFilters, ReportMetrics } from '@/types'

const getDateStamp = () => new Date().toISOString().split('T')[0]

export const exportToExcel = (incidents: Incident[]): void => {
  const rows = incidents.map((incident) => ({
    ID: incident.id,
    Fecha: new Date(incident.reportedAt).toLocaleString('es-AR'),
    Descripción: incident.description,
    Área: incident.area,
    Operador: incident.operator,
    Estado: incident.status,
    Prioridad: incident.priority,
    'Causa Raíz': incident.rootCause,
  }))

  const worksheet = XLSX.utils.json_to_sheet(rows)
  const workbook = XLSX.utils.book_new()

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Incidentes')
  XLSX.writeFile(workbook, `reporte-incidentes-${getDateStamp()}.xlsx`)
}

export const exportToPDF = (metrics: ReportMetrics, filters: ReportFilters): void => {
  const doc = new jsPDF()
  const lines = [
    'Reporte de Métricas OpsCore',
    '',
    `Período: ${filters.period === 'week' ? 'Semana' : filters.period === 'month' ? 'Mes' : filters.period === 'quarter' ? 'Trimestre' : 'No especificado'}`,
    `Área: ${filters.area || 'Todas las áreas'}`,
    `Rango de fechas: ${filters.dateFrom || '—'} a ${filters.dateTo || '—'}`,
    '',
    `Tiempo promedio de respuesta: ${metrics.avgResponseTime.toFixed(1)} hs`,
    `Tiempo promedio de resolución: ${metrics.avgResolutionTime.toFixed(1)} hs`,
    `Incidentes críticos: ${metrics.criticalCount}`,
    `Tasa de resolución: ${metrics.resolutionRate.toFixed(1)}%`,
    `Incidentes por área: ${metrics.incidentsByArea.map((item) => `${item.area} (${item.count})`).join(', ') || 'Sin datos'}`,
    `Causas raíz recurrentes: ${metrics.rootCauses.map((item) => `${item.cause} (${item.count})`).join(', ') || 'Sin datos'}`,
  ]

  doc.setFontSize(16)
  doc.text(lines[0], 14, 18)
  doc.setFontSize(11)

  let y = 28
  for (const line of lines.slice(1)) {
    doc.text(line, 14, y)
    y += 7
  }

  doc.save(`reporte-metricas-${getDateStamp()}.pdf`)
}
