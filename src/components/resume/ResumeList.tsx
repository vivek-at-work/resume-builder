"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Plus, FileText, Trash2, Edit, Calendar } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Resume {
  id: string
  title: string
  layout: string
  createdAt: string
  updatedAt: string
  personalInfo: any
  professionalSummary?: string
  workExperience: any[]
  education: any[]
  skills: any
}

interface ResumeListProps {
  onCreateNew: () => void
  onEdit: (resumeId: string) => void
}

export function ResumeList({ onCreateNew, onEdit }: ResumeListProps) {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [resumeToDelete, setResumeToDelete] = useState<string | null>(null)

  useEffect(() => {
    fetchResumes()
  }, [])

  const fetchResumes = async () => {
    try {
      const response = await fetch("/api/resumes")
      if (response.ok) {
        const data = await response.json()
        setResumes(data)
      }
    } catch (error) {
      console.error("Error fetching resumes:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (resumeId: string) => {
    try {
      const response = await fetch(`/api/resumes/${resumeId}`, {
        method: "DELETE",
      })
      if (response.ok) {
        setResumes(resumes.filter((r) => r.id !== resumeId))
        setDeleteDialogOpen(false)
        setResumeToDelete(null)
      }
    } catch (error) {
      console.error("Error deleting resume:", error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading resumes...</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">My Resumes</h2>
            <p className="text-muted-foreground">
              Create and manage multiple resumes
            </p>
          </div>
          <Button onClick={onCreateNew} className="gap-2">
            <Plus className="w-4 h-4" />
            Create New Resume
          </Button>
        </div>

        {/* Resume Grid */}
        {resumes.length === 0 ? (
          <Card className="p-12">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <FileText className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No resumes yet</h3>
              <p className="text-muted-foreground mb-6">
                Get started by creating your first resume
              </p>
              <Button onClick={onCreateNew} className="gap-2">
                <Plus className="w-4 h-4" />
                Create Your First Resume
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resumes.map((resume) => (
              <Card
                key={resume.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">
                        {resume.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-2">
                        <Calendar className="w-3 h-3" />
                        Updated {formatDate(resume.updatedAt)}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => onEdit(resume.id)}
                      className="flex-1 gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setResumeToDelete(resume.id)
                        setDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              resume.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (resumeToDelete) {
                  handleDelete(resumeToDelete)
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

