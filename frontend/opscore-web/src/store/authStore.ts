import { create } from 'zustand'

type UserRole = 'Supervisor' | 'Gerente'

interface AuthState {
  role: UserRole
  setRole: (role: UserRole) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  role: 'Gerente',
  setRole: (role) => set({ role }),
}))
