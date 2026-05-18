import { type LabelHTMLAttributes } from 'react'
import { cn } from '../../../utils/cn'

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
}

export function Label({ required, className, children, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        'block text-xs font-semibold uppercase tracking-wide text-foreground',
        className,
      )}
      {...props}
    >
      {children}
      {required && <span className="ml-1 text-badge-critical">*</span>}
    </label>
  )
}
