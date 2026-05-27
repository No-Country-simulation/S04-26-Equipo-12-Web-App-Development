import type { ReportFilters, ReportMetrics } from '@/types'
import { useIncidents } from './useIncidents'
import {
  computeAvgResolutionTime,
  computeAvgResponseTime,
  computeCriticalCount,
  computeIncidentsByArea,
  computeResolutionRate,
  computeRootCauses,
} from '../utils/computeMetrics'

export const useReportMetrics = (filters: ReportFilters) => {
  const { incidents, isLoading, isError } = useIncidents(filters)

  const metrics: ReportMetrics | null = incidents.length
    ? {
        avgResponseTime: computeAvgResponseTime(incidents),
        avgResolutionTime: computeAvgResolutionTime(incidents),
        criticalCount: computeCriticalCount(incidents),
        resolutionRate: computeResolutionRate(incidents),
        incidentsByArea: computeIncidentsByArea(incidents),
        rootCauses: computeRootCauses(incidents),
      }
    : null

  return {
    metrics,
    incidents,
    isLoading,
    isError,
  }
}
