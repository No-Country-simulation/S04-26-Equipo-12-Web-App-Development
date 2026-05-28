import { useState, type FormEvent } from 'react'
import { Mail, LockKeyhole, LogIn } from "lucide-react"
import { Card, FormField } from "@/components/molecules"
import { Input, Checkbox, Button } from "@/components/atoms"
import { useLogin } from '@/features/auth'
import logo from '@/assets/opscore_logo.jpg'


export const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { mutate, isPending, isError, error } = useLogin()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    mutate({ email, password })
  }

  const errorMessage =
    (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
    'Credenciales inválidas'

  return (
    <Card className="w-full max-w-sm mx-auto justify-center bg-background border border-surface-foreground/30">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-2 py-4 bg-transparent w-full">
        <img src={logo} alt="OpsCore Logo" className="w-32 mx-auto mb-4" />
        <FormField label="correo electrónico" htmlFor="email">
          <Input 
            id="email" 
            type="email" 
            icon={Mail}
            placeholder="Correo del usuario"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={isPending}
            required
            className="bg-background" 
          />
        </FormField>
        <FormField label="contraseña" htmlFor="password">
          <Input 
            id="password" 
            type="password" 
            icon={LockKeyhole} 
            placeholder="********"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={isPending}
            required
            className="bg-background" 
          />
        </FormField>
        <div className="flex justify-between">
          <Checkbox id="remember" label="Recuérdame" disabled={isPending} />
          <a href="#" className="text-sm text-primary hover:underline">¿Olvidaste tu contraseña?</a>
        </div>
        <Button type="submit" className="w-full mt-4" rightIcon={LogIn} disabled={isPending} loading={isPending}>
          Iniciar Sesión
        </Button>
        {isError && <p className="text-sm text-badge-critical">{errorMessage}</p>}
      </form>
    </Card>
  )
}
