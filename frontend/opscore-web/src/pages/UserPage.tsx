import { useMemo, useState } from 'react'
import { DashboardLayout } from "@/components/templates"
import { UserTable } from '@/components/organisms'
import type { UserRowData } from '@/components/molecules'

const OPERATORS: UserRowData[] = [
  {
    id: 'USR-001',
    area: 'Mantenimiento',
    legajo: 'L-1001',
    nombre: 'Carlos',
    apellido: 'Méndez',
    email: 'carlos.mendez@opscore.com',
    telefono: '+54 11 4555-1001',
    active: true,
  },
  {
    id: 'USR-002',
    area: 'Planta Sur',
    legajo: 'L-1002',
    nombre: 'Lucía',
    apellido: 'Paredes',
    email: 'lucia.paredes@opscore.com',
    telefono: '+54 11 4555-1002',
    active: true,
  },
  {
    id: 'USR-003',
    area: 'Logística',
    legajo: 'L-1003',
    nombre: 'Matías',
    apellido: 'Rojas',
    email: 'matias.rojas@opscore.com',
    telefono: '+54 11 4555-1003',
    active: false,
  },
  {
    id: 'USR-004',
    area: 'Control de Calidad',
    legajo: 'L-1004',
    nombre: 'Sofía',
    apellido: 'Luna',
    email: 'sofia.luna@opscore.com',
    telefono: '+54 11 4555-1004',
    active: true,
  },
  {
    id: 'USR-005',
    area: 'Administración',
    legajo: 'L-1005',
    nombre: 'Diego',
    apellido: 'Fernández',
    email: 'diego.fernandez@opscore.com',
    telefono: '+54 11 4555-1005',
    active: true,
  },
]

const SUPERVISORS: UserRowData[] = [
  {
    id: 'USR-006',
    area: 'Mantenimiento',
    legajo: 'L-2001',
    nombre: 'Marina',
    apellido: 'Gómez',
    email: 'marina.gomez@opscore.com',
    telefono: '+54 11 4666-2001',
    active: true,
  },
  {
    id: 'USR-007',
    area: 'Planta Sur',
    legajo: 'L-2002',
    nombre: 'Pablo',
    apellido: 'Suárez',
    email: 'pablo.suarez@opscore.com',
    telefono: '+54 11 4666-2002',
    active: true,
  },
  {
    id: 'USR-008',
    area: 'Logística',
    legajo: 'L-2003',
    nombre: 'Natalia',
    apellido: 'Torres',
    email: 'natalia.torres@opscore.com',
    telefono: '+54 11 4666-2003',
    active: true,
  },
  {
    id: 'USR-009',
    area: 'Control de Calidad',
    legajo: 'L-2004',
    nombre: 'Javier',
    apellido: 'Acosta',
    email: 'javier.acosta@opscore.com',
    telefono: '+54 11 4666-2004',
    active: false,
  },
  {
    id: 'USR-010',
    area: 'Administración',
    legajo: 'L-2005',
    nombre: 'Valeria',
    apellido: 'Nuñez',
    email: 'valeria.nunez@opscore.com',
    telefono: '+54 11 4666-2005',
    active: true,
  },
]

export const UserPage = () => {
  const [activeTab, setActiveTab] = useState('Operadores')
  const [searchQuery, setSearchQuery] = useState('')

  const users = useMemo(() => {
    return activeTab === 'Operadores' ? OPERATORS : SUPERVISORS
  }, [activeTab])

  const pageTitle = "Usuarios"

  return (
    <DashboardLayout pageTitle={pageTitle} userName="John Doe" userRole="Admin">
      <UserTable
        users={users}
        tab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
    </DashboardLayout>
  )
}
