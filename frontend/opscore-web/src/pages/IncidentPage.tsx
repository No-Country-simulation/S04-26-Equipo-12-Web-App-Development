import { DashboardLayout } from "@/components/templates"


export const IncidentPage = () => {
  
  const pageTitle = "Incidentes"

  return (
    <DashboardLayout pageTitle={pageTitle} userName="John Doe" userRole="Admin">
      <div>IncidentPage</div>
    </DashboardLayout>
  )
}