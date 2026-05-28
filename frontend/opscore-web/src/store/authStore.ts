import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserRole } from '@/types'

export interface ApiUser {
  id: number
  full_name: string
  first_name: string
  last_name: string
  email: string
  role: UserRole
  phone: string
  employee_code: string
  area: number | null
  area_name: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: ApiUser | null
  isAuthenticated: boolean
  setTokens: (access: string, refresh: string) => void
  setUser: (user: ApiUser) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      setTokens: (accessToken, refreshToken) =>
        set({
          accessToken,
          refreshToken,
          isAuthenticated: true,
        }),
      setUser: (user) => set({ user }),
      logout: () =>
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'auth-storage',
    },
  ),
)

export const authStore = useAuthStore

export default useAuthStore
