"use client"

import { useRouter } from "next/navigation"
import { SignOutButton, useUser } from "@clerk/nextjs"
import { ResumeForm } from "@/components/ResumeForm"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ResumeFormPageProps {
  resumeId?: string
}

export function ResumeFormPage({ resumeId }: ResumeFormPageProps) {
  const { user } = useUser()
  const router = useRouter()

  const handleBack = () => {
    router.push("/dashboard")
  }

  const handleSave = () => {
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-foreground">
              {resumeId ? "Edit Resume" : "Create New Resume"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {resumeId 
                ? "Update your resume information"
                : "Fill out the form to create your ATS-friendly resume"}
            </p>
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
            <SignOutButton>
              <Button variant="ghost">Sign Out</Button>
            </SignOutButton>
          </div>
        </div>
        
        <ResumeForm resumeId={resumeId || null} onBack={handleBack} onSave={handleSave} />
      </div>
    </div>
  )
}

