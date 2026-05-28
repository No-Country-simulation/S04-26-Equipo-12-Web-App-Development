import { type ButtonHTMLAttributes } from 'react'
import { type LucideIcon } from 'lucide-react'
import { cn } from '@/utils/cn'



interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  fullWidth?: boolean
  leftIcon?: LucideIcon
  rightIcon?: LucideIcon
  isActive?: boolean
}

export const Tab = ({children, className, isActive, ...props}: ButtonProps) => {
  return (
    <button 
      className={cn(
        'w-full p-2 m-1 rounded text-sm text-center',
        'transition-colors duration-150',
        'hover:bg-primary/70 hover:text-surface-background',
        isActive && 'bg-primary text-surface-background',
        className,
      )} 
      {...props}>
      {children}
    </button>
  )
}
