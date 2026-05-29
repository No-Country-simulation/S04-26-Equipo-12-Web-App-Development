import { useState } from 'react'
import { DashboardLayout } from "@/components/templates"
import { UserTable } from '@/components/organisms'
import { mapRowDataToCreatePayload, useCreateUser, useUsers } from '@/features/users'

type UserTab = 'Operadores' | 'Supervisores'

export const UserPage = () => {
  const [activeTab, setActiveTab] = useState<UserTab>('Operadores')
  const [searchQuery, setSearchQuery] = useState('')
  const { data: users = [], isLoading, isError } = useUsers()
  const { mutate } = useCreateUser()

  const pageTitle = "Usuarios"

  return (
    <DashboardLayout pageTitle={pageTitle}>
      {isLoading && (
        <p className="mb-4 text-sm text-surface-foreground">Cargando usuarios...</p>
      )}

      {isError && (
        <p className="mb-4 text-sm text-badge-critical">Error al cargar usuarios. Intentá de nuevo.</p>
      )}

      <UserTable
        users={users}
        tab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddUser={(data, role) => mutate(mapRowDataToCreatePayload(data, role))}
      />
    </DashboardLayout>
  )
}

