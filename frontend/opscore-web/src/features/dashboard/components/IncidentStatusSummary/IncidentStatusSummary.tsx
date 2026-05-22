import { Card } from "@/components/molecules/Card";
import { StatusSummary } from "@/components/organisms/StatusSummary";


const mockData = [
  { variant: 'critical' as const, label: 'Crítica', count: 5 },
  { variant: 'warning' as const, label: 'Media', count: 12 },
  { variant: 'in-progress' as const, label: 'En Progreso', count: 8 },
  { variant: 'resolved' as const, label: 'Resuelta', count: 20 },
]

export const IncidentStatusSummary = () => {
  return (
    <Card className="flex flex-col w-full ring-2 ring-outline-variant rounded">
        <h2 className="text-lg font-semibold text-foreground">Resumen de Estados de Incidencias</h2>
        <StatusSummary statuses={mockData} className="mt-4 gap-4" />
    </Card>
  )
}