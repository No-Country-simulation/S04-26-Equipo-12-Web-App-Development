import { type ReactNode } from 'react'
import { Sidebar, TopBar } from '@/components/organisms'


interface DashboardLayoutProps {
  children: ReactNode
  pageTitle: string
  userName: string
  userRole: string
  topBarAction?: {
    label: string
    onClick: () => void
  }
}

export function DashboardLayout({
  children,
  pageTitle,
  userName,
  userRole,
  topBarAction,
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar userName={userName} userRole={userRole} />
      <div className="flex flex-1 flex-col">
        <TopBar title={pageTitle} action={topBarAction} />
        <main className="flex-1 overflow-y-auto px-6 py-5">
          {children}
        </main>
      </div>
    </div>
  )
}
