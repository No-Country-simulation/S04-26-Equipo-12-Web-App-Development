export type BadgeVariant = 'critical' | 'warning' | 'resolved' | 'in-progress' | 'neutral'

export type UserRole = 'OPERATOR' | 'SUPERVISOR' | 'MANAGER' | 'ADMIN'

export interface Incident {
  id: string
  reportedAt: string // ISO date string
  assignedAt?: string
  closedAt?: string
  area: string
  description: string
  operator: string
  status: BadgeVariant
  priority: 'high' | 'medium' | 'low'
  rootCause: string
}

export interface ReportFilters {
  dateFrom?: string
  dateTo?: string
  area?: string
  period?: 'week' | 'month' | 'quarter'
  search?: string
}

export interface ReportMetrics {
  avgResponseTime: number // hours
  avgResolutionTime: number // hours
  criticalCount: number
  resolutionRate: number // 0-100 percentage
  incidentsByArea: { area: string; count: number }[]
  rootCauses: { cause: string; count: number }[]
}
