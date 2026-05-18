import { type ReactNode } from 'react'
import { cn } from '../../../utils/cn'
import logo from '../../../assets/opscore_logo_transparent.png'

interface AuthLayoutProps {
  children: ReactNode
  className?: string
}

export function AuthLayout({ children, className }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background">
      <img src={logo} alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 m-auto w-[520px] max-w-full opacity-10 select-none" />
      <span aria-hidden="true" className="pointer-events-none absolute bottom-8 left-0 right-0 text-center text-[72px] font-black tracking-tighter text-primary/5 select-none leading-none">
        opscore
      </span>
      <div className={cn('relative z-10 w-full max-w-sm rounded-2xl bg-surface-background shadow-xl px-8 py-10 flex flex-col items-center gap-6', className)}>
        <img src={logo} alt="OpsCore" className="size-16 object-contain" />
        {children}
      </div>
    </div>
  )
}
