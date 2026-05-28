import { useQuery } from '@tanstack/react-query'
import type { ReportFilters } from '@/types'
import { getIncidents } from '@/services/reportsService'

export const useIncidents = (filters: ReportFilters) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['incidents', filters],
    queryFn: () => getIncidents(filters),
  })

  return {
    incidents: data ?? [],
    isLoading,
    isError,
  }
}
