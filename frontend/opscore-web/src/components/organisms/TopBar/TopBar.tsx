import { Bell } from 'lucide-react'
import { Button, ThemeToggle } from '@/components/atoms'

interface TopBarProps {
  title: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function TopBar({ title, action }: TopBarProps) {
  return (
    <header className="flex items-center justify-between border-b border-outline-variant bg-background px-6 py-4">
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      <div className="flex items-center gap-3">
        {action && (
          <Button size="sm" onClick={action.onClick}>
            + {action.label}
          </Button>
        )}
        <button
          aria-label="Notificaciones"
          className="rounded-full p-1.5 text-surface-foreground hover:bg-surface-hover transition-colors"
        >
          <Bell size={18} />
        </button>
        <ThemeToggle />
      </div>
    </header>
  )
}
