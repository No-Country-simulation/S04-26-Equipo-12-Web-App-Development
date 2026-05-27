import { Card } from '@/components/molecules'
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

interface RootCausesChartProps {
  data: { cause: string; count: number }[]
}

const PIE_COLORS = ['#4f46e5', '#0ea5e9', '#f59e0b', '#10b981', '#ef4444']

export const RootCausesChart = ({ data }: RootCausesChartProps) => {
  return (
    <Card className="flex-col gap-4 ring-2 ring-outline-variant shadow-none">
      <h3 className="text-sm font-semibold text-foreground">Causas Raíz Recurrentes</h3>

      {data.length === 0 ? (
        <div className="flex h-[300px] items-center justify-center text-sm text-surface-foreground">
          Sin datos para el período seleccionado
        </div>
      ) : (
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="cause"
                cx="50%"
                cy="50%"
                outerRadius={92}
                label={({ name, percent }) => `${String(name)} ${(((percent ?? 0) * 100)).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`${entry.cause}-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  )
}
