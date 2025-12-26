"use client"

import { useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Upload, FileText, X, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react"
import { Header } from "@/components/layout/Header"
import { cn } from "@/lib/utils"
import type { ResumeFormData } from "@/lib/resumeSchema"
import { useToast } from "@/hooks/use-toast"

export function PDFUploadFullScreen() {
  const router = useRouter()
  const { toast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  const handleFileSelect = useCallback((selectedFile: File) => {
    if (selectedFile.type !== "application/pdf") {
      setError("Please select a PDF file")
      return false
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB")
      return false
    }
    setFile(selectedFile)
    setError(null)
    return true
  }, [])

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      handleFileSelect(selectedFile)
    }
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) {
      handleFileSelect(droppedFile)
    }
  }, [handleFileSelect])

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
      
      // Save the parsed resume automatically
      const title = parsedData.personalInfo?.fullName 
        ? `${parsedData.personalInfo.fullName}'s Resume`
        : "Untitled Resume"
      
      const resumeData = {
        title,
        layout: "layout1",
        isDraft: true,
        personalInfo: parsedData.personalInfo,
        professionalSummary: parsedData.professionalSummary,
        workExperience: parsedData.workExperience,
        education: parsedData.education,
        skills: parsedData.skills,
      }

      const saveResponse = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resumeData),
      })
      
      if (saveResponse.ok) {
        const savedResume = await saveResponse.json()
        
        toast({
          title: "Resume parsed and saved",
          description: "Your resume has been parsed and saved successfully.",
          duration: 3000,
        })
        
        // Redirect to edit page
        router.push(`/dashboard/resumes/${savedResume.id}/edit`)
      } else {
        throw new Error("Failed to save parsed resume")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to parse PDF"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      })
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard")}
          className="mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
          Back to Dashboard
        </Button>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-2">
              Upload Your Resume PDF
            </h1>
            <p className="text-muted-foreground text-lg">
              Drag and drop your PDF resume or click to browse
            </p>
          </div>

          {/* Full Screen Drag and Drop Zone */}
          <div
            ref={dropZoneRef}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "relative min-h-[60vh] rounded-2xl border-2 border-dashed transition-all duration-300 ease-out",
              "flex flex-col items-center justify-center p-12",
              isDragging
                ? "border-primary bg-primary/5 scale-[1.02] shadow-2xl"
                : file
                ? "border-blue-500 bg-blue-50/30"
                : "border-gray-300 bg-gray-50/50 hover:border-primary/50 hover:bg-gray-100/50"
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileInputChange}
              className="hidden"
              id="pdf-upload-fullscreen"
            />
            
            {file ? (
              <div className="flex flex-col items-center gap-6 animate-scale-in max-w-md">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
                    <FileText className="w-12 h-12 text-blue-600" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-white">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-semibold text-gray-900">{file.name}</h3>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <div className="flex gap-4 w-full">
                  <Button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="flex-1 gap-2 group h-12 text-lg"
                    size="lg"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Parsing Resume...
                      </>
                    ) : (
                      <>
                        <FileText className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
                        Parse & Continue
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleRemove}
                    disabled={uploading}
                    className="group h-12 px-6"
                    size="lg"
                  >
                    <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
                  </Button>
                </div>
                {uploading && (
                  <div className="w-full max-w-md">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-primary animate-pulse" style={{ width: "60%" }}></div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 text-center">
                      Extracting information from your resume...
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <label htmlFor="pdf-upload-fullscreen" className="cursor-pointer w-full">
                <div className="flex flex-col items-center gap-6 group">
                  <div className={cn(
                    "w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300",
                    isDragging
                      ? "bg-primary/20 scale-110"
                      : "bg-primary/10 group-hover:bg-primary/20 group-hover:scale-110"
                  )}>
                    <Upload className={cn(
                      "w-16 h-16 transition-all duration-300",
                      isDragging
                        ? "text-primary scale-110"
                        : "text-gray-400 group-hover:text-primary group-hover:translate-y-[-4px]"
                    )} />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-semibold text-gray-900">
                      {isDragging ? "Drop your PDF here" : "Drag & Drop your PDF"}
                    </h3>
                    <p className="text-gray-600">
                      or <span className="text-primary font-medium">browse</span> to select a file
                    </p>
                    <p className="text-sm text-gray-500 mt-4">
                      Supported format: PDF • Max file size: 10MB
                    </p>
                  </div>
                </div>
              </label>
            )}

            {error && (
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg animate-scale-in">
                  <p className="text-sm text-red-600 text-center">{error}</p>
                </div>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="mt-8 grid md:grid-cols-3 gap-4 animate-fade-in">
            <div className="p-4 bg-white rounded-lg border text-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <h4 className="font-semibold text-sm mb-1">AI-Powered Parsing</h4>
              <p className="text-xs text-muted-foreground">
                Automatically extracts all information from your resume
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg border text-center">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <h4 className="font-semibold text-sm mb-1">Instant Preview</h4>
              <p className="text-xs text-muted-foreground">
                See your resume formatted and ready to edit immediately
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg border text-center">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Upload className="w-5 h-5 text-purple-600" />
              </div>
              <h4 className="font-semibold text-sm mb-1">Easy Upload</h4>
              <p className="text-xs text-muted-foreground">
                Drag and drop or click to upload your PDF resume
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

