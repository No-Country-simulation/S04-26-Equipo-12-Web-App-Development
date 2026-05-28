import { useState } from 'react'
import { Modal } from '@/components/atoms'
import { Button, Input } from '@/components/atoms'
import { FormField } from '@/components/molecules'
import type { NewUserData } from '@/features/users/adapters'
import type { UserRole } from '@/types'

interface AddUserModalProps {
  isOpen: boolean
  onClose: () => void
  role: UserRole
  onSubmit: (data: NewUserData) => void
}

const ROLE_LABEL: Partial<Record<UserRole, string>> = {
  OPERATOR: 'Operador',
  SUPERVISOR: 'Supervisor',
  MANAGER: 'Manager',
}

const EMPTY: NewUserData = {
  area: '',
  legajo: '',
  nombre: '',
  apellido: '',
  email: '',
  password: '',
  telefono: '',
}

export function AddUserModal({ isOpen, onClose, role, onSubmit }: AddUserModalProps) {
  const [form, setForm] = useState<NewUserData>(EMPTY)

  const handleChange =
    (field: keyof NewUserData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
    }

  const handleClose = () => {
    setForm(EMPTY)
    onClose()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
    setForm(EMPTY)
    onClose()
  }

  const roleLabel = ROLE_LABEL[role] ?? role

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Agregar ${roleLabel}`}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Nombre" htmlFor="add-nombre" required>
            <Input
              id="add-nombre"
              placeholder="Juan"
              value={form.nombre}
              onChange={handleChange('nombre')}
              required
            />
          </FormField>
          <FormField label="Apellido" htmlFor="add-apellido" required>
            <Input
              id="add-apellido"
              placeholder="Pérez"
              value={form.apellido}
              onChange={handleChange('apellido')}
              required
            />
          </FormField>
        </div>

        <FormField label="Email" htmlFor="add-email" required>
          <Input
            id="add-email"
            type="email"
            placeholder="juan.perez@opscore.com"
            value={form.email}
            onChange={handleChange('email')}
            required
          />
        </FormField>

        <FormField label="Contraseña" htmlFor="add-password" required>
          <Input
            id="add-password"
            type="password"
            placeholder="********"
            value={form.password}
            onChange={handleChange('password')}
            required
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Área" htmlFor="add-area" required>
            <Input
              id="add-area"
              placeholder="Mantenimiento"
              value={form.area}
              onChange={handleChange('area')}
              required
            />
          </FormField>
          <FormField label="Legajo" htmlFor="add-legajo" required>
            <Input
              id="add-legajo"
              placeholder="L-1001"
              value={form.legajo}
              onChange={handleChange('legajo')}
              required
            />
          </FormField>
        </div>

        <FormField label="Teléfono" htmlFor="add-telefono">
          <Input
            id="add-telefono"
            type="tel"
            placeholder="+54 11 4555-0000"
            value={form.telefono}
            onChange={handleChange('telefono')}
          />
        </FormField>

        <div className="flex justify-end gap-3 mt-2">
          <Button type="button" variant="ghost" size="sm" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" size="sm">
            Agregar {roleLabel}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

