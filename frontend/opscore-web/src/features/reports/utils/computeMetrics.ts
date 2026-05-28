import type { Incident } from '@/types'

const HOUR_MS = 1000 * 60 * 60

const roundToOneDecimal = (value: number) => Math.round(value * 10) / 10

export const computeAvgResponseTime = (incidents: Incident[]): number => {
  const withAssignedAt = incidents.filter((incident) => incident.assignedAt)

  if (withAssignedAt.length === 0) return 0

  const totalHours = withAssignedAt.reduce((acc, incident) => {
    const reportedAt = new Date(incident.reportedAt).getTime()
    const assignedAt = new Date(incident.assignedAt as string).getTime()
    return acc + (assignedAt - reportedAt) / HOUR_MS
  }, 0)

  return roundToOneDecimal(totalHours / withAssignedAt.length)
}

export const computeAvgResolutionTime = (incidents: Incident[]): number => {
  const resolved = incidents.filter((incident) => incident.status === 'resolved' && incident.closedAt)

  if (resolved.length === 0) return 0

  const totalHours = resolved.reduce((acc, incident) => {
    const reportedAt = new Date(incident.reportedAt).getTime()
    const closedAt = new Date(incident.closedAt as string).getTime()
    return acc + (closedAt - reportedAt) / HOUR_MS
  }, 0)

  return roundToOneDecimal(totalHours / resolved.length)
}

export const computeResolutionRate = (incidents: Incident[]): number => {
  if (incidents.length === 0) return 0

  const resolvedCount = incidents.filter((incident) => incident.status === 'resolved').length
  const rate = (resolvedCount / incidents.length) * 100

  return roundToOneDecimal(rate)
}

export const computeIncidentsByArea = (incidents: Incident[]): { area: string; count: number }[] => {
  const grouped = incidents.reduce<Record<string, number>>((acc, incident) => {
    acc[incident.area] = (acc[incident.area] ?? 0) + 1
    return acc
  }, {})

  return Object.entries(grouped)
    .map(([area, count]) => ({ area, count }))
    .sort((a, b) => b.count - a.count)
}

export const computeRootCauses = (incidents: Incident[]): { cause: string; count: number }[] => {
  const grouped = incidents.reduce<Record<string, number>>((acc, incident) => {
    acc[incident.rootCause] = (acc[incident.rootCause] ?? 0) + 1
    return acc
  }, {})

  return Object.entries(grouped)
    .map(([cause, count]) => ({ cause, count }))
    .sort((a, b) => b.count - a.count)
}

export const computeCriticalCount = (incidents: Incident[]): number => {
  return incidents.filter((incident) => incident.priority === 'high').length
}
