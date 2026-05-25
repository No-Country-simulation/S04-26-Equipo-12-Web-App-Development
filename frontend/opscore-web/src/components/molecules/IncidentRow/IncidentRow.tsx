import { ChevronRight } from 'lucide-react'
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

function StatusPill({ variant, label }: { variant: BadgeVariant; label: string }) {
  const styles = {
    critical: {
      pill: 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-100 dark:border-red-800',
      dot: 'bg-red-600',
    },
    'in-progress': {
      pill: 'bg-gray-100 dark:bg-gray-800 text-surface-foreground border border-gray-200 dark:border-gray-700',
      dot: 'bg-blue-700',
    },
    resolved: {
      pill: 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-100 dark:border-green-800',
      dot: 'bg-green-600',
    },
    warning: {
      pill: 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border border-yellow-100 dark:border-yellow-800',
      dot: 'bg-yellow-500',
    },
    neutral: {
      pill: 'bg-surface-background text-surface-foreground border border-outline-variant',
      dot: 'bg-gray-400',
    },
  }[variant]

  const formatted = label ? label.charAt(0).toUpperCase() + label.slice(1).toLowerCase() : ''

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${styles.pill}`}>
      <span className={`inline-block w-2.5 h-2.5 rounded-full ${styles.dot}`} />
      <span className="leading-none">{formatted}</span>
    </span>
  )
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
        <div className="flex justify-end">
          <StatusPill variant={incident.status} label={incident.statusLabel} />
        </div>
      </td>
      <td className="px-4 py-3 text-surface-foreground">
        <ChevronRight size={16} />
      </td>
    </tr>
  )
}
