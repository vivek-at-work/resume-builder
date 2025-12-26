"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, FileText, X, Loader2 } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { ResumeFormData } from "@/lib/resumeSchema"

interface PDFUploadProps {
  onParseComplete: (data: ResumeFormData) => void
  onCancel?: () => void
}

export function PDFUpload({ onParseComplete, onCancel }: PDFUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        setError("Please select a PDF file")
        return
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB")
        return
      }
      setFile(selectedFile)
      setError(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/resumes/parse-pdf", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        const errorMessage = errorData.details 
          ? `${errorData.error}: ${errorData.details}`
          : errorData.error || "Failed to parse PDF"
        throw new Error(errorMessage)
      }

      const parsedData: ResumeFormData = await response.json()
      onParseComplete(parsedData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse PDF")
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setFile(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Upload Resume PDF
        </CardTitle>
        <CardDescription>
          Upload your existing resume PDF to automatically fill in the form
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileSelect}
            className="hidden"
            id="pdf-upload"
          />
          <label htmlFor="pdf-upload">
            <div className={cn(
              "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300 ease-out",
              file 
                ? "border-blue-500 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-600 hover:shadow-md" 
                : "border-gray-300 bg-gray-50/50 hover:bg-gray-100 hover:border-primary/50 hover:shadow-sm"
            )}>
              {file ? (
                <div className="flex flex-col items-center gap-2 animate-scale-in">
                  <FileText className="w-8 h-8 text-blue-600 animate-bounce-in" />
                  <span className="text-sm font-medium text-gray-900">{file.name}</span>
                  <span className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(2)} KB
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 group">
                  <Upload className="w-8 h-8 text-gray-400 group-hover:text-primary group-hover:translate-y-[-2px] transition-all duration-200" />
                  <span className="text-sm text-gray-600 group-hover:text-primary transition-colors duration-200">
                    Click to upload PDF resume
                  </span>
                  <span className="text-xs text-gray-500">
                    Max file size: 10MB
                  </span>
                </div>
              )}
            </div>
          </label>
        </div>

        {file && (
          <div className="flex gap-2 animate-slide-in-right">
            <Button
              onClick={handleUpload}
              disabled={uploading}
              className="flex-1 gap-2 group"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Parsing...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" />
                  Parse Resume
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleRemove}
              disabled={uploading}
              className="group"
            >
              <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
            </Button>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md animate-scale-in">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {onCancel && (
          <Button variant="ghost" onClick={onCancel} className="w-full hover:bg-accent/50">
            Cancel
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

