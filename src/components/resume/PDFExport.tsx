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
      
      // Ensure the element has proper styling for PDF export
      const originalBg = element.style.backgroundColor
      element.style.backgroundColor = "#ffffff"
      element.classList.add("pdf-export")
      
      const opt = {
        margin: [0.5, 0.5, 0.5, 0.5] as [number, number, number, number],
        filename: `${fileName}.pdf`,
        image: { type: "jpeg" as const, quality: 1.0 },
        html2canvas: { 
          scale: 3, // Increased from 2 to 3 for better quality
          useCORS: true,
          letterRendering: true,
          logging: false,
          backgroundColor: "#ffffff", // Ensure white background
          removeContainer: false,
          allowTaint: true,
          windowWidth: element.scrollWidth,
          windowHeight: element.scrollHeight,
          onclone: (clonedDoc: Document) => {
            // Ensure all elements have proper color rendering
            const clonedElement = clonedDoc.querySelector('.pdf-export') as HTMLElement
            if (clonedElement) {
              clonedElement.style.backgroundColor = "#ffffff"
              // Force better contrast for text elements
              const textElements = clonedElement.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, li, td, th')
              textElements.forEach((el) => {
                const htmlEl = el as HTMLElement
                const computedStyle = window.getComputedStyle(htmlEl)
                const color = computedStyle.color
                // Make light gray text darker for better contrast
                if (color && (
                  color.includes('rgb(156') || 
                  color.includes('rgb(107') || 
                  color.includes('rgb(75') ||
                  color.includes('rgb(115') ||
                  color.includes('rgb(148')
                )) {
                  htmlEl.style.color = "#000000"
                }
              })
            }
          },
        },
        jsPDF: { 
          unit: "in" as const, 
          format: "letter" as const, 
          orientation: "portrait" as const,
          compress: false, // Disable compression for better quality
        },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] as any },
      }

      await html2pdf().set(opt).from(element).save()
      
      // Restore original styling
      element.style.backgroundColor = originalBg
      element.classList.remove("pdf-export")
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

