import { DashboardLayout } from "@/components/templates"


export const ReportPage = () => {
  
  const pageTitle = "Reportes"

  return (
    <DashboardLayout pageTitle={pageTitle} userName="John Doe" userRole="Admin">
      <div>ReportsPage</div>
    </DashboardLayout>
  )
}