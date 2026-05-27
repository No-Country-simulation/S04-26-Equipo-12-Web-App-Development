import { FileSpreadsheet, FileText } from 'lucide-react'
import { Button } from '@/components/atoms'

interface ExportBarProps {
  onExportExcel: () => void
  onExportPDF: () => void
}

export const ExportBar = ({ onExportExcel, onExportPDF }: ExportBarProps) => {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <Button type="button" variant="secondary" leftIcon={FileSpreadsheet} onClick={onExportExcel}>
        Exportar Excel
      </Button>
      <Button type="button" variant="primary" leftIcon={FileText} onClick={onExportPDF}>
        Exportar PDF
      </Button>
    </div>
  )
}
