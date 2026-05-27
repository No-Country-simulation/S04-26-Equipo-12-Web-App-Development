import { Card } from '@/components/molecules'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface IncidentsByAreaChartProps {
  data: { area: string; count: number }[]
}

export const IncidentsByAreaChart = ({ data }: IncidentsByAreaChartProps) => {
  return (
    <Card className="flex-col gap-4 ring-2 ring-outline-variant shadow-none">
      <h3 className="text-sm font-semibold text-foreground">Incidentes por Área</h3>

      {data.length === 0 ? (
        <div className="flex h-[300px] items-center justify-center text-sm text-surface-foreground">
          Sin datos para el período seleccionado
        </div>
      ) : (
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-outline-variant)" />
              <XAxis type="number" tick={{ fill: 'var(--color-surface-foreground)', fontSize: 12 }} />
              <YAxis type="category" dataKey="area" width={110} tick={{ fill: 'var(--color-surface-foreground)', fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="var(--color-primary)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  )
}
