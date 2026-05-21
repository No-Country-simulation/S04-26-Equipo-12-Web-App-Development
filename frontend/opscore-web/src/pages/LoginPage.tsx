import { AuthLayout } from "@/components/templates"
import { LoginForm } from "@/features/login"
import { ThemeToggle } from "@/components/atoms"


export const LoginPage = () => {
  return (
    <AuthLayout>
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <LoginForm />
    </AuthLayout>
  )
}