import { Mail, LockKeyhole, LogIn } from "lucide-react"
import { Card, FormField } from "@/components/molecules"
import { Input, Checkbox, Button } from "@/components/atoms"
import logo from '@/assets/opscore_logo.jpg'


export const LoginForm = () => {
  return (
    <Card className="w-full max-w-sm mx-auto justify-center bg-background border border-surface-foreground/30">
      <div className="flex flex-col gap-4 px-2 py-4 bg-transparent w-full">
        <img src={logo} alt="OpsCore Logo" className="w-32 mx-auto mb-4" />
        <FormField label="correo electrónico" htmlFor="email">
          <Input 
            id="email" 
            type="email" 
            icon={Mail}
            placeholder="Correo del usuario"
            className="bg-background" 
          />
        </FormField>
        <FormField label="contraseña" htmlFor="password">
          <Input 
            id="password" 
            type="password" 
            icon={LockKeyhole} 
            placeholder="********"
            className="bg-background" 
          />
        </FormField>
        <div className="flex justify-between">
          <Checkbox id="remember" label="Recuérdame" />
          <a href="#" className="text-sm text-primary hover:underline">¿Olvidaste tu contraseña?</a>
        </div>
        <Button className="w-full mt-4" rightIcon={LogIn}>Iniciar Sesión</Button>
      </div>
    </Card>
  )
}