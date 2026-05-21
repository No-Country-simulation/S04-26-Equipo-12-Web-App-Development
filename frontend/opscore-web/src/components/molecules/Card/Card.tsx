import { cn } from '@/utils/cn'


interface CardProps {
  className?: string
  children: React.ReactNode
}

export const Card = ({ className, children }: CardProps) => {
  return (
    <div className={cn('flex rounded-xl bg-surface-background p-4 shadow', className)}>
      {children}
    </div>
  )
}