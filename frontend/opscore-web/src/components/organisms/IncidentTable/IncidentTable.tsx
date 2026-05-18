import { Filter } from 'lucide-react'
import { SelectFilter } from '../../molecules'
import { IncidentRow } from '../../molecules'
import type { IncidentRowData } from '../../molecules'

interface IncidentTableProps {
  incidents: IncidentRowData[]
  onRowClick?: (id: string) => void
  onFilterChange?: (key: string, value: string) => void
}

const areaOptions = [
  { value: '', label: 'Todas las Áreas' },
  { value: 'sector-a', label: 'Sector A' },
  { value: 'sector-b', label: 'Sector B' },
  { value: 'sector-c', label: 'Sector C' },
]

const priorityOptions = [
  { value: '', label: 'Todas' },
  { value: 'critical', label: 'Crítica' },
  { value: 'warning', label: 'Media' },
  { value: 'low', label: 'Baja' },
]

const statusOptions = [
  { value: 'active', label: 'Activos' },
  { value: 'resolved', label: 'Resueltos' },
  { value: '', label: 'Todos' },
]

const columns = ['ID', 'Fecha/Hora', 'Descripción', 'Ubicación', 'Operario', 'Estado', 'Acciones']

export function IncidentTable({ incidents, onRowClick, onFilterChange }: IncidentTableProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Filters */}
      <div className="flex items-end gap-3 flex-wrap">
        <Filter size={16} className="text-surface-foreground mb-2" />
        <SelectFilter
          label="Área"
          id="filter-area"
          options={areaOptions}
          onChange={(e) => onFilterChange?.('area', e.target.value)}
        />
        <SelectFilter
          label="Prioridad"
          id="filter-priority"
          options={priorityOptions}
          onChange={(e) => onFilterChange?.('priority', e.target.value)}
        />
        <SelectFilter
          label="Estado"
          id="filter-status"
          options={statusOptions}
          onChange={(e) => onFilterChange?.('status', e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-outline-variant">
        <table className="w-full text-left">
          <thead className="bg-surface-background-deep">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-surface-foreground"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-background">
            {incidents.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-10 text-center text-sm text-surface-foreground"
                >
                  No se encontraron incidencias con los filtros aplicados.
                </td>
              </tr>
            ) : (
              incidents.map((incident) => (
                <IncidentRow
                  key={incident.id}
                  incident={incident}
                  onClick={onRowClick}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
