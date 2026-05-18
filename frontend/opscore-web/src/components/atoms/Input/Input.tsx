import { type InputHTMLAttributes, type Ref } from 'react'
import { type LucideIcon } from 'lucide-react'
import { cn } from '../../../utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  ref?: Ref<HTMLInputElement>
  icon?: LucideIcon
  error?: boolean
}

export function Input({ ref, icon: Icon, error = false, className, ...props }: InputProps) {
  return (
    <div className="relative flex items-center">
      {Icon && (
        <Icon size={16} className="absolute left-3 text-surface-foreground pointer-events-none" />
      )}
      <input
        ref={ref}
        className={cn(
          'w-full rounded-md border bg-surface-background text-foreground',
          'placeholder:text-surface-foreground text-sm',
          'py-2 pr-3 transition-colors duration-150',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          Icon ? 'pl-9' : 'pl-3',
          error ? 'border-badge-critical focus:ring-badge-critical' : 'border-outline-variant',
          className,
        )}
        {...props}
      />
    </div>
  )
}
