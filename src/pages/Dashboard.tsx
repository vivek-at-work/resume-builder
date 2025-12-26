"use client"

import { SignOutButton, useUser } from "@clerk/nextjs"
import { ResumeList } from "@/components/resume/ResumeList"
import { Button } from "@/components/ui/button"
import Link from "next/link"
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
      <div className="w-full px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-foreground">
              Welcome back, {user?.firstName || "User"}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Create and manage your ATS-friendly resumes
            </p>
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
            <SignOutButton>
              <Button variant="ghost">Sign Out</Button>
            </SignOutButton>
          </div>
        </div>
        
        <ResumeList onCreateNew={handleCreateNew} onEdit={handleEdit} />
      </div>
    </div>
  )
}

