import { LayoutDashboard, AlertCircle, BarChart2, Users } from 'lucide-react'
import { NavItem } from '@/components/molecules'
import { Avatar } from '@/components/atoms'
import logo from '@/assets/opscore_logo.jpg'
import type { UserRole } from '@/types'

interface SidebarProps {
  userName: string
  userRole: UserRole
}

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['OPERATOR', 'SUPERVISOR', 'MANAGER', 'ADMIN'] as UserRole[] },
  { to: '/incidents', label: 'Incidentes', icon: AlertCircle, roles: ['OPERATOR', 'SUPERVISOR', 'MANAGER', 'ADMIN'] as UserRole[] },
  { to: '/reports', label: 'Reportes', icon: BarChart2, roles: ['SUPERVISOR', 'MANAGER', 'ADMIN'] as UserRole[] },
  { to: '/users', label: 'Usuarios', icon: Users, roles: ['SUPERVISOR', 'MANAGER', 'ADMIN'] as UserRole[] },
]

export function Sidebar({ userName, userRole }: SidebarProps) {
  const visibleItems = navItems.filter((item) => item.roles.includes(userRole))

  return (
    <aside className="flex min-h-screen w-[200px] flex-col bg-surface-background border-r border-outline-variant">
      {/* Brand */}
      <div className="flex items-center gap-2 px-4 py-4 border-b border-outline-variant">
        <img src={logo} alt="OpsCore" className="w-8 h-8 object-contain rounded" />
        <div className="leading-tight">
          <p className="text-sm font-bold text-foreground tracking-wide">OPSCORE</p>
          <p className="text-[10px] text-surface-foreground">Operations Consulting</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {visibleItems.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </nav>

      {/* User footer */}
      <div className="flex items-center gap-2.5 border-t border-outline-variant px-4 py-3">
        <Avatar name={userName} size="sm" />
        <div className="min-w-0 leading-tight">
          <p className="text-sm font-medium text-foreground truncate">{userName}</p>
          <p className="text-xs text-surface-foreground truncate">{userRole}</p>
        </div>
      </div>
    </aside>
  )
}
