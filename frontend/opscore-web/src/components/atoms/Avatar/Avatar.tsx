import { cn } from '../../../utils/cn'

interface AvatarProps {
  name: string
  size?: 'sm' | 'md' | 'lg'
  src?: string
  className?: string
}

const sizeStyles = {
  sm: 'size-7 text-xs',
  md: 'size-9 text-sm',
  lg: 'size-11 text-base',
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

export function Avatar({ name, size = 'md', src, className }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn('rounded-full object-cover bg-secondary-background', sizeStyles[size], className)}
      />
    )
  }

  return (
    <span
      aria-label={name}
      className={cn(
        'inline-flex items-center justify-center rounded-full',
        'bg-primary text-white font-semibold select-none',
        sizeStyles[size],
        className,
      )}
    >
      {getInitials(name)}
    </span>
  )
}
