import { LayoutDashboard, AlertCircle, BarChart2, Users } from 'lucide-react'
import { NavLink } from 'react-router'
import { type LucideIcon } from 'lucide-react'
import { Avatar } from '@/components/atoms'

interface NavItem {
  to: string
  label: string
  icon: LucideIcon
}

interface BottomNavProps {
  userName: string
  userRole: string
}

const navItems: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/incidents', label: 'Incidentes', icon: AlertCircle },
  { to: '/reports', label: 'Reportes', icon: BarChart2 },
  { to: '/users', label: 'Usuarios', icon: Users },
]

export function BottomNav({ userName, userRole }: BottomNavProps) {
  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 md:hidden">
      <div className="flex items-center gap-1 rounded-2xl bg-white dark:bg-surface-background shadow-lg border border-outline-variant px-3 py-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                'flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl text-xs font-medium transition-colors duration-150 min-w-[60px]',
                isActive
                  ? 'text-primary'
                  : 'text-surface-foreground hover:text-foreground',
              ].join(' ')
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.75} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}

        {/* User item */}
        <div className="flex flex-col items-center gap-1 px-4 py-1.5 min-w-[60px]">
          <Avatar name={userName} size="sm" />
          <span className="text-xs font-medium text-surface-foreground truncate max-w-[60px]">
            {userRole}
          </span>
        </div>
      </div>
    </nav>
  )
}
