"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, Sparkles, Copy, Check } from "lucide-react"

interface TextImprovementModalProps {
  open: boolean
  onClose: () => void
  originalText: string
  sectionType: string
  sectionId?: string
  onAccept: (improvedText: string) => void
}

export function TextImprovementModal({
  open,
  onClose,
  originalText,
  sectionType,
  sectionId,
  onAccept,
}: TextImprovementModalProps) {
  const [alternatives, setAlternatives] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const fetchAlternatives = async () => {
    setLoading(true)
    setError(null)
    
    try {
      console.log("Fetching alternatives for:", { originalText, sectionType, sectionId })
      
      const response = await fetch("/api/resumes/improve-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: originalText,
          sectionType,
          sectionId,
        }),
      })

      console.log("API response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("API error:", errorData)
        throw new Error(errorData.error || "Failed to generate alternatives")
      }

      const data = await response.json()
      console.log("API response data:", data)
      setAlternatives(data.alternatives || [])
    } catch (err) {
      console.error("Error fetching alternatives:", err)
      setError(err instanceof Error ? err.message : "Failed to generate alternatives")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open && originalText) {
      fetchAlternatives()
    } else {
      setAlternatives([])
      setError(null)
      setCopiedIndex(null)
    }
  }, [open, originalText])

  const handleCopy = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const handleAccept = (text: string) => {
    onAccept(text)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            AI Text Alternatives
          </DialogTitle>
          <DialogDescription>
            Select an improved version or copy it to use elsewhere
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Original Text */}
          <div className="p-4 bg-gray-50 rounded-lg border">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Original:</h3>
            <p className="text-gray-900 whitespace-pre-wrap">{originalText}</p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Generating alternatives...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchAlternatives}
                className="mt-2"
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Alternatives */}
          {!loading && !error && alternatives.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700">
                Suggested Alternatives ({alternatives.length}):
              </h3>
              {alternatives.map((alt, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg hover:border-blue-300 transition-colors bg-white"
                >
                  <p className="text-gray-900 whitespace-pre-wrap mb-3">{alt}</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleAccept(alt)}
                      className="flex-1"
                    >
                      Use This Version
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopy(alt, index)}
                    >
                      {copiedIndex === index ? (
                        <>
                          <Check className="w-4 h-4 mr-1" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Alternatives */}
          {!loading && !error && alternatives.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No alternatives generated. Try again.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

