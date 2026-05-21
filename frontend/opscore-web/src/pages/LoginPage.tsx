import { AuthLayout } from "@/components/templates"
import { LoginForm } from "@/features/login"


export const LoginPage = () => {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  )
}