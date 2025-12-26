"use client"

import { useState, useRef, useEffect } from "react"
import { Sparkles } from "lucide-react"
import { TextImprovementPopover } from "./TextImprovementPopover"

interface SelectableTextProps {
  children: React.ReactNode
  sectionType: "heading" | "statement" | "description" | "summary" | "skill"
  sectionId?: string // e.g., "workExp-0", "education-1", "professionalSummary"
  onSelect: (text: string, sectionType: string, sectionId?: string) => void
  onAccept: (improvedText: string) => void
  className?: string
}

export function SelectableText({
  children,
  sectionType,
  sectionId,
  onSelect,
  onAccept,
  className = "",
}: SelectableTextProps) {
  const [isSelected, setIsSelected] = useState(false)
  const [selectedText, setSelectedText] = useState("")
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLDivElement>(null)
  const selectionTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleMouseUp = (e: MouseEvent) => {
      // Small delay to ensure selection is complete
      setTimeout(() => {
        const selection = window.getSelection()
        if (!selection || selection.rangeCount === 0) {
          setIsSelected(false)
          setSelectedText("")
          return
        }

        const selectedText = selection.toString().trim()
        
        if (selectedText.length > 0) {
          // Check if selection is within this component
          const range = selection.getRangeAt(0)
          const container = containerRef.current
          
          if (container) {
            // Check if the selection is within our container
            const isWithinContainer = 
              container.contains(range.commonAncestorContainer) ||
              container.contains(range.startContainer) ||
              container.contains(range.endContainer)
            
            if (isWithinContainer) {
              setSelectedText(selectedText)
              setIsSelected(true)
              
              // Calculate button position based on mouse/cursor position
              const mouseX = e.clientX
              const mouseY = e.clientY
              
              // Get button dimensions (estimate if not rendered yet)
              const buttonWidth = 200 // Approximate width
              const buttonHeight = 40 // Approximate height
              const offset = 10 // Distance from cursor
              
              // Calculate position, ensuring it stays within viewport
              let top = mouseY - buttonHeight - offset
              let left = mouseX - buttonWidth / 2
              
              // Adjust if button would go off-screen
              const viewportWidth = window.innerWidth
              const viewportHeight = window.innerHeight
              
              if (left < 10) {
                left = 10
              } else if (left + buttonWidth > viewportWidth - 10) {
                left = viewportWidth - buttonWidth - 10
              }
              
              if (top < 10) {
                // If not enough space above, show below cursor
                top = mouseY + offset
              } else if (top + buttonHeight > viewportHeight - 10) {
                top = viewportHeight - buttonHeight - 10
              }
              
              setButtonPosition({ top, left })
              
              // Clear previous timeout
              if (selectionTimeoutRef.current) {
                clearTimeout(selectionTimeoutRef.current)
              }
              
              // Auto-deselect after 5 seconds if no action
              selectionTimeoutRef.current = setTimeout(() => {
                setIsSelected(false)
                setSelectedText("")
                selection.removeAllRanges()
              }, 5000)
            } else {
              setIsSelected(false)
              setSelectedText("")
            }
          }
        } else {
          setIsSelected(false)
          setSelectedText("")
        }
      }, 10)
    }

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      const button = document.querySelector('[data-selectable-button]')
      
      // Don't close if clicking on the button itself
      if (button && button.contains(target)) {
        return
      }
      
      if (containerRef.current && !containerRef.current.contains(target)) {
        setIsSelected(false)
        setSelectedText("")
        window.getSelection()?.removeAllRanges()
      }
    }

    document.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("mousedown", handleClickOutside)
      if (selectionTimeoutRef.current) {
        clearTimeout(selectionTimeoutRef.current)
      }
    }
  }, [])

  const handleImproveClick = () => {
    if (selectedText) {
      onSelect(selectedText, sectionType, sectionId)
      setPopoverOpen(true)
      // Keep selection visible but don't clear it yet
    }
  }

  const handleAccept = (improvedText: string) => {
    onAccept(improvedText)
    setPopoverOpen(false)
    setIsSelected(false)
    setSelectedText("")
    window.getSelection()?.removeAllRanges()
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {children}
      {isSelected && selectedText && (
        <div className="fixed z-[100]" style={{ top: `${buttonPosition.top}px`, left: `${buttonPosition.left}px` }}>
          <TextImprovementPopover
            open={popoverOpen}
            onOpenChange={(open) => {
              setPopoverOpen(open)
              if (!open) {
                setIsSelected(false)
                setSelectedText("")
                window.getSelection()?.removeAllRanges()
              }
            }}
            originalText={selectedText}
            sectionType={sectionType}
            sectionId={sectionId}
            onAccept={handleAccept}
            trigger={
              <div
                ref={buttonRef}
                data-selectable-button
                className="bg-blue-600 text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 cursor-pointer hover:bg-blue-700 transition-all animate-in fade-in-0 zoom-in-95 duration-200"
                onClick={(e) => {
                  e.stopPropagation()
                  handleImproveClick()
                }}
                onMouseEnter={() => {
                  // Cancel auto-dismiss when hovering over button
                  if (selectionTimeoutRef.current) {
                    clearTimeout(selectionTimeoutRef.current)
                  }
                }}
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Get AI alternatives</span>
              </div>
            }
          />
        </div>
      )}
    </div>
  )
}

