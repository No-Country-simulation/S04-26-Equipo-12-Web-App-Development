import { type ReactNode } from 'react'
import { Label } from '../../atoms'
import { cn } from '../../../utils/cn'

interface FormFieldProps {
  label: string
  htmlFor: string
  required?: boolean
  error?: string
  hint?: string
  children: ReactNode
  className?: string
}

export function FormField({ label, htmlFor, required, error, hint, children, className }: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <Label htmlFor={htmlFor} required={required}>
        {label}
      </Label>
      {children}
      {hint && !error && <p className="text-xs text-surface-foreground">{hint}</p>}
      {error && <p role="alert" className="text-xs text-badge-critical">{error}</p>}
    </div>
  )
}
