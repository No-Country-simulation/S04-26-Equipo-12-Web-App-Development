import { ChevronRight } from 'lucide-react'
import { Badge } from '../../atoms'
import type { BadgeVariant } from '../../../types'

export interface IncidentRowData {
  id: string
  date: string
  description: string
  location: string
  operator: string
  status: BadgeVariant
  statusLabel: string
}

interface IncidentRowProps {
  incident: IncidentRowData
  onClick?: (id: string) => void
}

export function IncidentRow({ incident, onClick }: IncidentRowProps) {
  return (
    <tr
      className="border-b border-outline-variant hover:bg-surface-hover transition-colors duration-100 cursor-pointer"
      onClick={() => onClick?.(incident.id)}
    >
      <td className="px-4 py-3 text-xs text-surface-foreground font-mono whitespace-nowrap">
        <div>{incident.id}</div>
        <div className="text-[11px] text-surface-foreground/70">{incident.date}</div>
      </td>
      <td className="px-4 py-3 text-sm text-foreground max-w-xs truncate">
        {incident.description}
      </td>
      <td className="px-4 py-3 text-sm text-surface-foreground whitespace-nowrap">
        {incident.location}
      </td>
      <td className="px-4 py-3 text-sm text-surface-foreground whitespace-nowrap">
        {incident.operator}
      </td>
      <td className="px-4 py-3">
        <Badge variant={incident.status} label={incident.statusLabel} />
      </td>
      <td className="px-4 py-3 text-surface-foreground">
        <ChevronRight size={16} />
      </td>
    </tr>
  )
}
