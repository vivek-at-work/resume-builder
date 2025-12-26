"use client"

import { useRouter } from "next/navigation"
import { ResumeForm } from "@/components/ResumeForm"
import { Header } from "@/components/layout/Header"

interface ResumeFormPageProps {
  resumeId?: string
}

export function ResumeFormPage({ resumeId }: ResumeFormPageProps) {
  const router = useRouter()

  const handleBack = () => {
    router.push("/dashboard")
  }

  const handleSave = () => {
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Header />
      <div className="container mx-auto px-4 py-6 space-y-6 animate-fade-in">
        {/* Page Header */}
        <div className="flex justify-between items-center animate-slide-in-left">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {resumeId ? "Edit Resume" : "Create New Resume"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {resumeId 
                ? "Update your resume information"
                : "Fill out the form to create your ATS-friendly resume"}
            </p>
          </div>
        </div>
        
        <ResumeForm resumeId={resumeId || null} onBack={handleBack} onSave={handleSave} />
      </div>
    </div>
  )
}

