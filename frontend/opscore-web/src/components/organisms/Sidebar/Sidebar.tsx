import { LayoutDashboard, AlertCircle, BarChart2, Users } from 'lucide-react'
import { NavItem } from '../../molecules'
import { Avatar } from '../../atoms'
import logo from '../../../assets/opscore_logo_transparent.png'

interface SidebarProps {
  userName: string
  userRole: string
}

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/incidents', label: 'Incidentes', icon: AlertCircle },
  { to: '/reports', label: 'Reportes', icon: BarChart2 },
  { to: '/users', label: 'Usuarios', icon: Users },
]

export function Sidebar({ userName, userRole }: SidebarProps) {
  return (
    <aside className="flex h-full w-[200px] flex-col bg-surface-background border-r border-outline-variant">
      {/* Brand */}
      <div className="flex items-center gap-2 px-4 py-4 border-b border-outline-variant">
        <img src={logo} alt="OpsCore" className="size-8 object-contain" />
        <div className="leading-tight">
          <p className="text-sm font-bold text-foreground tracking-wide">OPSCORE</p>
          <p className="text-[10px] text-surface-foreground">Operations Consulting</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {navItems.map((item) => (
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
