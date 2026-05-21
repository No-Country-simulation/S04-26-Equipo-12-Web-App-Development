import { DashboardLayout } from "@/components/templates"


export const UserPage = () => {
  
  const pageTitle = "Usuarios"

  return (
    <DashboardLayout pageTitle={pageTitle} userName="John Doe" userRole="Admin">
      <div>UserPage</div>
    </DashboardLayout>
  )
}