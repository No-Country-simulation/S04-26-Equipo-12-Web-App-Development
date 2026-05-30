import { type ReactNode } from 'react'
import { Sidebar, TopBar, BottomNav } from '@/components/organisms'
import { useAuthStore } from '@/store'
import type { UserRole } from '@/types'

interface DashboardLayoutProps {
  children: ReactNode
  pageTitle: string
  topBarAction?: {
    label: string
    onClick: () => void
  }
}

export function DashboardLayout({ children, pageTitle, topBarAction }: DashboardLayoutProps) {
  const user = useAuthStore((state) => state.user)
  const userName = user?.full_name ?? ''
  const userRole = (user?.role ?? 'OPERATOR') as UserRole

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden md:flex">
        <Sidebar userName={userName} userRole={userRole} />
      </div>
      <div className="flex flex-1 flex-col">
        <TopBar title={pageTitle} action={topBarAction} />
        <main className="flex-1 overflow-y-auto px-6 py-5 pb-24 md:pb-5">
          {children}
        </main>
      </div>
      <BottomNav userName={userName} userRole={userRole} />
    </div>
  )
}
