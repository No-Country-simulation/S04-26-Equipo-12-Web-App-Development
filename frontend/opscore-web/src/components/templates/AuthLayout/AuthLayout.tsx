import { type ReactNode } from 'react'
import { cn } from '@/utils/cn'
import logo from '@/assets/opscore_logo_transparent.png'

interface AuthLayoutProps {
  children: ReactNode
  className?: string
}

export function AuthLayout({ children, className }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background">
      <img src={logo} alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 m-auto w-[800px] max-w-full opacity-70 select-none" />
      <div className={cn('relative z-10 w-full max-w-sm rounded-2xl bg-surface-background shadow-xl px-8 py-10 flex flex-col items-center gap-6', className)}>
        {children}
      </div>
    </div>
  )
}
