import { MoreVertical } from 'lucide-react'
import { Button } from '../../atoms'
import { cn } from '@/utils/cn'

export interface UserRowData {
  id: string
  area: string
  legajo: string
  nombre: string
  apellido: string
  email: string
  telefono: string
  active?: boolean
}

interface UserRowProps {
  user: UserRowData
  onAction?: (id: string) => void
}

export function UserRow({ user, onAction }: UserRowProps) {
  return (
    <tr
      className={cn(
        'border-b border-outline-variant hover:bg-surface-hover transition-colors duration-100',
        user.active === false && 'opacity-50',
      )}
    >
      <td className="px-4 py-3 text-xs text-surface-foreground font-mono">{user.id}</td>
      <td className="px-4 py-3 text-sm text-foreground">{user.area}</td>
      <td className="px-4 py-3 text-sm text-surface-foreground">{user.legajo}</td>
      <td className={cn('px-4 py-3 text-sm text-foreground', user.active === false && 'line-through')}>
        {user.nombre}
      </td>
      <td className={cn('px-4 py-3 text-sm text-foreground', user.active === false && 'line-through')}>
        {user.apellido}
      </td>
      <td className="px-4 py-3 text-sm text-surface-foreground">{user.email}</td>
      <td className="px-4 py-3 text-sm text-surface-foreground">{user.telefono}</td>
      <td className="px-4 py-3">
        <Button
          variant="ghost"
          size="sm"
          aria-label="Acciones"
          onClick={() => onAction?.(user.id)}
        >
          <MoreVertical size={16} />
        </Button>
      </td>
    </tr>
  )
}
