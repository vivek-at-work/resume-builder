"use client"

import { useState, useEffect } from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Loader2, Sparkles, Copy, Check, X } from "lucide-react"

interface TextImprovementPopoverProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  originalText: string
  sectionType: string
  sectionId?: string
  onAccept: (improvedText: string) => void
  trigger: React.ReactNode
}

export function TextImprovementPopover({
  open,
  onOpenChange,
  originalText,
  sectionType,
  sectionId,
  onAccept,
  trigger,
}: TextImprovementPopoverProps) {
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
    onOpenChange(false)
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {trigger}
      </PopoverTrigger>
      <PopoverContent 
        className="w-[500px] max-h-[600px] overflow-y-auto p-4"
        align="start"
        side="bottom"
        sideOffset={8}
      >
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-semibold text-gray-900">AI Alternatives</h3>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Original Text */}
          <div className="p-3 bg-gray-50 rounded-md border text-xs">
            <p className="text-gray-600 mb-1 font-medium">Original:</p>
            <p className="text-gray-900 whitespace-pre-wrap text-sm">{originalText}</p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              <span className="ml-2 text-sm text-gray-600">Generating...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 text-xs mb-2">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchAlternatives}
                className="w-full"
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Alternatives */}
          {!loading && !error && alternatives.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-700">
                {alternatives.length} suggestion{alternatives.length > 1 ? 's' : ''}:
              </p>
              {alternatives.map((alt, index) => (
                <div
                  key={index}
                  className="p-3 border rounded-md hover:border-blue-300 transition-colors bg-white"
                >
                  <p className="text-gray-900 whitespace-pre-wrap text-sm mb-2">{alt}</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleAccept(alt)}
                      className="flex-1 text-xs h-7"
                    >
                      Use This
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopy(alt, index)}
                      className="h-7 px-2"
                    >
                      {copiedIndex === index ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Alternatives */}
          {!loading && !error && alternatives.length === 0 && (
            <div className="text-center py-4 text-gray-500 text-sm">
              <p>No alternatives generated. Try again.</p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

