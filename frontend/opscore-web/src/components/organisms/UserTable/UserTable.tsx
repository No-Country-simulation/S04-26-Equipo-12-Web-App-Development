import { useMemo, useState } from 'react'
import { UserPlus, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button, Tab } from '@/components/atoms'
import { SearchInput, UserRow } from '@/components/molecules'
import type { UserRowData } from '@/components/molecules'
import { AddUserModal } from '@/features/users'
import { cn } from '@/utils/cn'

interface UserTableProps {
  users: UserRowData[]
  tab: string
  onTabChange: (tab: string) => void
  searchQuery: string
  onSearchChange: (q: string) => void
  onUserAction?: (id: string) => void
  onAddUser?: (data: Omit<UserRowData, 'id' | 'active'>, role: string) => void
}

const columns = ['ID', 'Área', 'Legajo', 'Nombre', 'Apellido', 'Email', 'Teléfono', 'Acciones']
const PAGE_SIZE = 5

export function UserTable({
  users,
  tab,
  onTabChange,
  searchQuery,
  onSearchChange,
  onUserAction,
  onAddUser,
}: UserTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    if (!query) return users

    return users.filter((user) => {
      return [user.id, user.nombre, user.apellido, user.legajo].some((value) =>
        value.toLowerCase().includes(query),
      )
    })
  }, [users, searchQuery])

  const totalUsers = filteredUsers.length
  const totalPages = Math.max(1, Math.ceil(totalUsers / PAGE_SIZE))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const pageUsers = filteredUsers.slice(
    (safeCurrentPage - 1) * PAGE_SIZE,
    safeCurrentPage * PAGE_SIZE,
  )

  const startItem = totalUsers === 0 ? 0 : (safeCurrentPage - 1) * PAGE_SIZE + 1
  const endItem = Math.min(safeCurrentPage * PAGE_SIZE, totalUsers)

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <div className="flex flex-col gap-4">
      {/* Tabs + Add button */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-1 ring-2 ring-outline-variant rounded text-foreground">
          {['Operadores', 'Supervisores'].map((tabLabel) => (
            <Tab
              key={tabLabel}
              isActive={tab === tabLabel}
              onClick={() => {
                setCurrentPage(1)
                onTabChange(tabLabel)
              }}
              className="px-4 py-1.5"
            >
              {tabLabel}
            </Tab>
          ))}
        </div>
        <Button size="sm" type="button" onClick={() => setIsModalOpen(true)}>
          <UserPlus size={14} />
          Agregar usuario
        </Button>
      </div>

      {/* Search + Filters */}
      <div className="flex w-full justify-between items-center flex-wrap gap-3">
        <SearchInput
          placeholder="Buscar por ID, nombre o legajo..."
          className="max-w-xs"
          value={searchQuery}
          onChange={(e) => {
            setCurrentPage(1)
            onSearchChange(e.target.value)
          }}
        />
        <Button variant="ghost" size="sm" type="button" className={cn('text-foreground ring-2 ring-outline-variant rounded', 'hover:bg-surface-hover')}>
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
            {pageUsers.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-10 text-center text-sm text-surface-foreground"
                >
                  No se encontraron usuarios.
                </td>
              </tr>
            ) : (
              pageUsers.map((user) => (
                <UserRow key={user.id} user={user} onAction={onUserAction} />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-xs text-surface-foreground">
          Mostrando {startItem} a {endItem} de {totalUsers} usuarios
        </p>

        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Página anterior"
            disabled={safeCurrentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            className="rounded-md p-1.5 text-surface-foreground hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
          </button>

          {pageNumbers.map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              className={cn(
                'min-w-8 rounded-md px-2 py-1 text-xs font-medium transition-colors',
                safeCurrentPage === page
                  ? 'bg-primary text-white'
                  : 'text-surface-foreground hover:bg-surface-hover',
              )}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            aria-label="Página siguiente"
            disabled={safeCurrentPage === totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            className="rounded-md p-1.5 text-surface-foreground hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <AddUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        role={tab}
        onSubmit={(data) => onAddUser?.(data, tab)}
      />
    </div>
  )
}
