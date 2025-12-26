"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface PDFExportProps {
  resumeContentRef: React.RefObject<HTMLDivElement | null>
  fileName?: string
}

export function PDFExport({ resumeContentRef, fileName = "resume" }: PDFExportProps) {
  const handleExportPDF = async () => {
    if (!resumeContentRef.current) {
      alert("Resume content not found")
      return
    }

    try {
      // Dynamic import to avoid SSR issues
      const html2pdf = (await import("html2pdf.js")).default
      const element = resumeContentRef.current
      
      const opt = {
        margin: [0.5, 0.5, 0.5, 0.5] as [number, number, number, number],
        filename: `${fileName}.pdf`,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true,
          logging: false,
        },
        jsPDF: { 
          unit: "in" as const, 
          format: "letter" as const, 
          orientation: "portrait" as const,
        },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] as any },
      }

      await html2pdf().set(opt).from(element).save()
    } catch (error) {
      console.error("Error exporting PDF:", error)
      alert("Failed to export PDF. Please try again.")
    }
  }

  return (
    <Button onClick={handleExportPDF} className="gap-2">
      <Download className="w-4 h-4" />
      Export as PDF
    </Button>
  )
}

