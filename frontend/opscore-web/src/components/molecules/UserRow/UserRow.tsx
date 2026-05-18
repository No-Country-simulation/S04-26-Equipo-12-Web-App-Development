import { MoreVertical } from 'lucide-react'
import { Button } from '../../atoms'

export interface UserRowData {
  id: string
  area: string
  legajo: string
  firstName: string
  lastName: string
  email: string
  phone: string
}

interface UserRowProps {
  user: UserRowData
  onAction?: (id: string) => void
}

export function UserRow({ user, onAction }: UserRowProps) {
  return (
    <tr className="border-b border-outline-variant hover:bg-surface-hover transition-colors duration-100">
      <td className="px-4 py-3 text-xs text-surface-foreground font-mono">{user.id}</td>
      <td className="px-4 py-3 text-sm text-foreground">{user.area}</td>
      <td className="px-4 py-3 text-sm text-surface-foreground">{user.legajo}</td>
      <td className="px-4 py-3 text-sm text-foreground">{user.firstName}</td>
      <td className="px-4 py-3 text-sm text-foreground">{user.lastName}</td>
      <td className="px-4 py-3 text-sm text-surface-foreground">{user.email}</td>
      <td className="px-4 py-3 text-sm text-surface-foreground">{user.phone}</td>
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
