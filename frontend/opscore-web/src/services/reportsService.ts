import type { Incident, ReportFilters } from '@/types'

const HOUR_MS = 1000 * 60 * 60
const DAY_MS = 24 * HOUR_MS

const AREAS = ['Producción', 'Mantenimiento', 'Logística', 'Calidad', 'Seguridad'] as const
const ROOT_CAUSES = ['Falla eléctrica', 'Error humano', 'Desgaste de equipos', 'Falla de software', 'Condición ambiental'] as const

const createIncident = ({
  id,
  daysAgo,
  area,
  description,
  operator,
  status,
  priority,
  rootCause,
  assignedDelayHours,
  resolvedDelayDays,
}: {
  id: string
  daysAgo: number
  area: Incident['area']
  description: string
  operator: string
  status: Incident['status']
  priority: Incident['priority']
  rootCause: Incident['rootCause']
  assignedDelayHours: number
  resolvedDelayDays?: number
}): Incident => {
  const now = Date.now()
  const reportedAtDate = new Date(now - daysAgo * DAY_MS)
  const assignedAtDate = new Date(reportedAtDate.getTime() + assignedDelayHours * HOUR_MS)

  return {
    id,
    reportedAt: reportedAtDate.toISOString(),
    assignedAt: assignedAtDate.toISOString(),
    closedAt: status === 'resolved' && resolvedDelayDays ? new Date(assignedAtDate.getTime() + resolvedDelayDays * DAY_MS).toISOString() : undefined,
    area,
    description,
    operator,
    status,
    priority,
    rootCause,
  }
}

const INCIDENTS: Incident[] = [
  createIncident({ id: 'INC-1001', daysAgo: 2, area: AREAS[0], description: 'Parada no planificada por variación de voltaje en línea principal.', operator: 'J. Ramírez', status: 'resolved', priority: 'high', rootCause: ROOT_CAUSES[0], assignedDelayHours: 2, resolvedDelayDays: 1 }),
  createIncident({ id: 'INC-1002', daysAgo: 5, area: AREAS[1], description: 'Fallo intermitente en compresor durante turno nocturno.', operator: 'M. Gómez', status: 'in-progress', priority: 'medium', rootCause: ROOT_CAUSES[2], assignedDelayHours: 3 }),
  createIncident({ id: 'INC-1003', daysAgo: 8, area: AREAS[2], description: 'Demora en despacho por error en validación de guía interna.', operator: 'A. Suárez', status: 'warning', priority: 'medium', rootCause: ROOT_CAUSES[1], assignedDelayHours: 4 }),
  createIncident({ id: 'INC-1004', daysAgo: 11, area: AREAS[3], description: 'Desvío en control de calidad por calibración incompleta.', operator: 'L. Pérez', status: 'resolved', priority: 'low', rootCause: ROOT_CAUSES[1], assignedDelayHours: 2, resolvedDelayDays: 2 }),
  createIncident({ id: 'INC-1005', daysAgo: 14, area: AREAS[4], description: 'Sensor térmico fuera de rango por humedad elevada.', operator: 'D. Torres', status: 'critical', priority: 'high', rootCause: ROOT_CAUSES[4], assignedDelayHours: 1 }),
  createIncident({ id: 'INC-1006', daysAgo: 18, area: AREAS[0], description: 'Falla de software en módulo de trazabilidad de lotes.', operator: 'N. Díaz', status: 'resolved', priority: 'high', rootCause: ROOT_CAUSES[3], assignedDelayHours: 5, resolvedDelayDays: 1 }),
  createIncident({ id: 'INC-1007', daysAgo: 22, area: AREAS[1], description: 'Ruido anómalo en banda transportadora de empaque.', operator: 'S. Acosta', status: 'neutral', priority: 'low', rootCause: ROOT_CAUSES[2], assignedDelayHours: 6 }),
  createIncident({ id: 'INC-1008', daysAgo: 26, area: AREAS[2], description: 'Corte de comunicación con terminal de despacho móvil.', operator: 'P. Rojas', status: 'resolved', priority: 'medium', rootCause: ROOT_CAUSES[3], assignedDelayHours: 2, resolvedDelayDays: 2 }),
  createIncident({ id: 'INC-1009', daysAgo: 29, area: AREAS[3], description: 'Ingreso incompleto de datos de inspección final.', operator: 'F. Molina', status: 'warning', priority: 'medium', rootCause: ROOT_CAUSES[1], assignedDelayHours: 3 }),
  createIncident({ id: 'INC-1010', daysAgo: 33, area: AREAS[4], description: 'Corte parcial en alimentación eléctrica de sala segura.', operator: 'C. Núñez', status: 'resolved', priority: 'high', rootCause: ROOT_CAUSES[0], assignedDelayHours: 1, resolvedDelayDays: 1 }),
  createIncident({ id: 'INC-1011', daysAgo: 37, area: AREAS[0], description: 'Ajuste incorrecto de válvula en circuito secundario.', operator: 'I. Herrera', status: 'in-progress', priority: 'medium', rootCause: ROOT_CAUSES[1], assignedDelayHours: 2 }),
  createIncident({ id: 'INC-1012', daysAgo: 41, area: AREAS[1], description: 'Desgaste avanzado en rodamientos de motor auxiliar.', operator: 'R. Castro', status: 'critical', priority: 'high', rootCause: ROOT_CAUSES[2], assignedDelayHours: 4 }),
  createIncident({ id: 'INC-1013', daysAgo: 46, area: AREAS[2], description: 'Retrabajo por lectura errónea en sistema de picking.', operator: 'V. Soto', status: 'resolved', priority: 'medium', rootCause: ROOT_CAUSES[3], assignedDelayHours: 2, resolvedDelayDays: 2 }),
  createIncident({ id: 'INC-1014', daysAgo: 52, area: AREAS[3], description: 'Muestreo inválido por condición ambiental fuera de norma.', operator: 'E. Medina', status: 'neutral', priority: 'low', rootCause: ROOT_CAUSES[4], assignedDelayHours: 5 }),
  createIncident({ id: 'INC-1015', daysAgo: 58, area: AREAS[4], description: 'Bloqueo de acceso por error humano en credenciales.', operator: 'T. Varela', status: 'resolved', priority: 'low', rootCause: ROOT_CAUSES[1], assignedDelayHours: 3, resolvedDelayDays: 1 }),
  createIncident({ id: 'INC-1016', daysAgo: 64, area: AREAS[0], description: 'Microcorte eléctrico afectó sensores de línea de mezcla.', operator: 'G. Cabrera', status: 'warning', priority: 'high', rootCause: ROOT_CAUSES[0], assignedDelayHours: 2 }),
  createIncident({ id: 'INC-1017', daysAgo: 70, area: AREAS[1], description: 'Tiempo de respuesta elevado por cola de mantenimiento.', operator: 'B. Luna', status: 'resolved', priority: 'medium', rootCause: ROOT_CAUSES[2], assignedDelayHours: 7, resolvedDelayDays: 2 }),
  createIncident({ id: 'INC-1018', daysAgo: 76, area: AREAS[2], description: 'Sincronización fallida entre sistema de stock y ERP.', operator: 'K. Díaz', status: 'in-progress', priority: 'medium', rootCause: ROOT_CAUSES[3], assignedDelayHours: 4 }),
  createIncident({ id: 'INC-1019', daysAgo: 82, area: AREAS[3], description: 'Condensación en sala de análisis alteró mediciones.', operator: 'H. Funes', status: 'resolved', priority: 'high', rootCause: ROOT_CAUSES[4], assignedDelayHours: 2, resolvedDelayDays: 1 }),
  createIncident({ id: 'INC-1020', daysAgo: 88, area: AREAS[4], description: 'Incidente crítico por reinicio inesperado de control central.', operator: 'O. Vidal', status: 'critical', priority: 'high', rootCause: ROOT_CAUSES[3], assignedDelayHours: 1 }),
]

const matchesPeriod = (incident: Incident, period?: ReportFilters['period']) => {
  if (!period) return true

  const daysLimit = period === 'week' ? 7 : period === 'month' ? 30 : 90
  const threshold = Date.now() - daysLimit * DAY_MS

  return new Date(incident.reportedAt).getTime() >= threshold
}

export const getIncidents = async (filters?: ReportFilters): Promise<Incident[]> => {
  const normalizedSearch = filters?.search?.trim().toLowerCase()

  const filtered = INCIDENTS.filter((incident) => {
    if (!matchesPeriod(incident, filters?.period)) {
      return false
    }

    if (filters?.dateFrom) {
      const dateFrom = new Date(`${filters.dateFrom}T00:00:00`).getTime()
      if (new Date(incident.reportedAt).getTime() < dateFrom) {
        return false
      }
    }

    if (filters?.dateTo) {
      const dateTo = new Date(`${filters.dateTo}T23:59:59.999`).getTime()
      if (new Date(incident.reportedAt).getTime() > dateTo) {
        return false
      }
    }

    if (filters?.area && incident.area !== filters.area) {
      return false
    }

    if (normalizedSearch && !incident.description.toLowerCase().includes(normalizedSearch)) {
      return false
    }

    return true
  })

  return Promise.resolve(filtered)
}
