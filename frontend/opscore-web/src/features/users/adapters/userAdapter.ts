import type { UserRowData } from '@/components/molecules'
import type { ApiUser } from '@/store/authStore'
import type { UserRole } from '@/types'

export interface CreateUserPayload {
  email: string
  first_name: string
  last_name: string
  password: string
  role: UserRole
  phone?: string
  area?: number
  employee_code?: string
}

export interface NewUserData {
  area: string
  legajo: string
  nombre: string
  apellido: string
  email: string
  password: string
  telefono: string
}

export function mapApiUserToRowData(apiUser: ApiUser): UserRowData {
  return {
    id: String(apiUser.id),
    role: apiUser.role,
    area: apiUser.area_name ?? '',
    legajo: apiUser.employee_code,
    nombre: apiUser.first_name,
    apellido: apiUser.last_name,
    email: apiUser.email,
    telefono: apiUser.phone,
    active: apiUser.is_active,
  }
}

export function mapRowDataToCreatePayload(data: NewUserData, role: UserRole): CreateUserPayload {
  return {
    email: data.email,
    first_name: data.nombre,
    last_name: data.apellido,
    password: data.password,
    role,
    phone: data.telefono || undefined,
    // The form currently has area name as text, not area id.
    area: undefined,
    employee_code: data.legajo || undefined,
  }
}
