import { Search } from 'lucide-react'
import { Input } from '../../atoms'
import { type InputHTMLAttributes } from 'react'

type SearchInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>

export function SearchInput({ className = '', ...props }: SearchInputProps) {
  return (
    <Input
      type="search"
      icon={Search}
      className={className}
      {...props}
    />
  )
}
