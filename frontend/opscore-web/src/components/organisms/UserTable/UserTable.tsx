import { UserPlus, Filter } from 'lucide-react'
import { Button } from '../../atoms'
import { SearchInput, UserRow } from '../../molecules'
import type { UserRowData } from '../../molecules'

type UserTab = 'operators' | 'supervisors'

interface UserTableProps {
  users: UserRowData[]
  activeTab: UserTab
  onTabChange: (tab: UserTab) => void
  onAddUser: () => void
  onUserAction?: (id: string) => void
  onSearch?: (query: string) => void
}

const columns = ['ID', 'Área', 'Legajo', 'Nombre', 'Apellido', 'Email', 'Teléfono', 'Acciones']

export function UserTable({
  users,
  activeTab,
  onTabChange,
  onAddUser,
  onUserAction,
  onSearch,
}: UserTableProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Tabs + Add button */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2">
          {(['operators', 'supervisors'] as UserTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={[
                'rounded-md px-4 py-1.5 text-sm font-medium transition-colors',
                activeTab === tab
                  ? 'bg-primary text-white'
                  : 'bg-surface-background text-surface-foreground hover:bg-surface-hover',
              ].join(' ')}
            >
              {tab === 'operators' ? 'Operadores' : 'Supervisores'}
            </button>
          ))}
        </div>
        <Button size="sm" onClick={onAddUser}>
          <UserPlus size={14} />
          Agregar usuario
        </Button>
      </div>

      {/* Search + Filters */}
      <div className="flex items-center gap-3">
        <SearchInput
          placeholder="Buscar por ID, nombre o legajo..."
          className="max-w-xs"
          onChange={(e) => onSearch?.(e.target.value)}
        />
        <Button variant="ghost" size="sm">
          <Filter size={14} />
          Filtros
        </Button>
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
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-10 text-center text-sm text-surface-foreground"
                >
                  No se encontraron usuarios.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <UserRow key={user.id} user={user} onAction={onUserAction} />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination hint */}
      <p className="text-xs text-surface-foreground">
        Mostrando {users.length} usuarios
      </p>
    </div>
  )
}
