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
    <Card>
      <CardHeader>
        <CardTitle>Upload Resume PDF</CardTitle>
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
            <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              {file ? (
                <div className="flex flex-col items-center gap-2">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <span className="text-sm font-medium">{file.name}</span>
                  <span className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(2)} KB
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-600">
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
          <div className="flex gap-2">
            <Button
              onClick={handleUpload}
              disabled={uploading}
              className="flex-1 gap-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Parsing...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  Parse Resume
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleRemove}
              disabled={uploading}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {onCancel && (
          <Button variant="ghost" onClick={onCancel} className="w-full">
            Cancel
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

