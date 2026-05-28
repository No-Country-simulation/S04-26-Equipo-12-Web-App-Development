import { Input } from '@/components/atoms'
import { SearchInput, SelectFilter } from '@/components/molecules'
import type { ReportFilters } from '@/types'
import { cn } from '@/utils/cn'

interface ReportFilterBarProps {
  filters: ReportFilters
  onChange: (filters: ReportFilters) => void
}

const areaOptions = [
  { value: '', label: 'Todas las áreas' },
  { value: 'Producción', label: 'Producción' },
  { value: 'Mantenimiento', label: 'Mantenimiento' },
  { value: 'Logística', label: 'Logística' },
  { value: 'Calidad', label: 'Calidad' },
  { value: 'Seguridad', label: 'Seguridad' },
]

const periodOptions = [
  { value: '', label: 'Todos los períodos' },
  { value: 'week', label: 'Semana' },
  { value: 'month', label: 'Mes' },
  { value: 'quarter', label: 'Trimestre' },
]

export const ReportFilterBar = ({ filters, onChange }: ReportFilterBarProps) => {
  return (
    <div className={cn('rounded bg-surface-background ring-2 ring-outline-variant p-4', 'flex flex-wrap items-end gap-3')}>
      <div className="flex min-w-[160px] flex-1 flex-col gap-1">
        <label htmlFor="dateFrom" className="text-xs font-semibold uppercase tracking-wide text-surface-foreground">
          Desde
        </label>
        <Input
          id="dateFrom"
          type="date"
          value={filters.dateFrom || ''}
          onChange={(event) => onChange({ ...filters, dateFrom: event.target.value || undefined })}
        />
      </div>

      <div className="flex min-w-[160px] flex-1 flex-col gap-1">
        <label htmlFor="dateTo" className="text-xs font-semibold uppercase tracking-wide text-surface-foreground">
          Hasta
        </label>
        <Input
          id="dateTo"
          type="date"
          value={filters.dateTo || ''}
          onChange={(event) => onChange({ ...filters, dateTo: event.target.value || undefined })}
        />
      </div>

      <SelectFilter
        id="area"
        label="Área"
        className="min-w-[180px]"
        value={filters.area || ''}
        options={areaOptions}
        onChange={(event) => onChange({ ...filters, area: event.target.value || undefined })}
      />

      <SelectFilter
        id="period"
        label="Período"
        className="min-w-[180px]"
        value={filters.period || ''}
        options={periodOptions}
        onChange={(event) => onChange({ ...filters, period: (event.target.value || undefined) as ReportFilters['period'] })}
      />

      <div className="min-w-[220px] flex-[1.4]">
        <label htmlFor="search" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-surface-foreground">
          Buscar
        </label>
        <SearchInput
          id="search"
          placeholder="Buscar en descripción..."
          value={filters.search || ''}
          onChange={(event) => onChange({ ...filters, search: event.target.value || undefined })}
        />
      </div>
    </div>
  )
}
