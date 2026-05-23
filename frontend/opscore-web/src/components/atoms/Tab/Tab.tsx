import { type ButtonHTMLAttributes } from 'react'
import { type LucideIcon } from 'lucide-react'
import { cn } from '@/utils/cn'


interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  fullWidth?: boolean
  leftIcon?: LucideIcon
  rightIcon?: LucideIcon
}

export const Tab = ({children, ...props}: ButtonProps) => {
  return (
    <button {...props}>{children}</button>
  )
}