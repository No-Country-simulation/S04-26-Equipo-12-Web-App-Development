import { type ButtonHTMLAttributes } from 'react'
import { type LucideIcon } from 'lucide-react'
import { cn } from '@/utils/cn'



interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  fullWidth?: boolean
  leftIcon?: LucideIcon
  rightIcon?: LucideIcon
}

export const Tab = ({children, className, ...props}: ButtonProps) => {
  return (
    <button 
      className={cn(
        'w-full p-12 mb-2 text-sm text-center border-2 border-primary-700 rounded-tl-lg rounded-tr-lg',
        'transition-colors duration-150',
        'active:bg-primary-700 active:text-secondary-500',
        'hover:bg-primary-600 hover:text-secondary-500',
        className,
      )} 
      {...props}>
      {children}
    </button>
  )
}
