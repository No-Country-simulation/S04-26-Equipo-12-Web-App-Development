import { DashboardLayout } from "@/components/templates"


export const DashboardPage = () => {
  
  const pageTitle = "Dashboard"

  return (
    <DashboardLayout pageTitle={pageTitle} userName="John Doe" userRole="Admin">
      <div>DashboardPage</div>
    </DashboardLayout>
  )
}