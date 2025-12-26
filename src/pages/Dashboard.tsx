"use client"

import { useUser } from "@clerk/nextjs"
import { ResumeList } from "@/components/resume/ResumeList"
import { Header } from "@/components/layout/Header"
import { useRouter } from "next/navigation"

export function Dashboard() {
  const { user } = useUser()
  const router = useRouter()

  const handleCreateNew = () => {
    router.push("/dashboard/resumes/new")
  }

  const handleEdit = (resumeId: string) => {
    router.push(`/dashboard/resumes/${resumeId}/edit`)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Welcome back, {user?.firstName || "User"}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Create and manage your ATS-friendly resumes
            </p>
          </div>
        </div>
        
        <ResumeList onCreateNew={handleCreateNew} onEdit={handleEdit} />
      </div>
    </div>
  )
}

