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
import { Plus, FileText, Trash2, Edit, Calendar, Upload } from "lucide-react"
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
      <div className="flex items-center justify-center h-64 animate-fade-in">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading resumes...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="animate-slide-in-left">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              My Resumes
            </h2>
            <p className="text-muted-foreground mt-1">
              Create and manage multiple resumes
            </p>
          </div>
          <div className="flex gap-2 animate-slide-in-right">
            <Button 
              onClick={() => window.location.href = "/dashboard/resumes/upload"}
              variant="outline"
              className="gap-2 hover:scale-105"
            >
              <Upload className="w-4 h-4" />
              Upload PDF
            </Button>
            <Button 
              onClick={onCreateNew} 
              className="gap-2 hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              Create New Resume
            </Button>
          </div>
        </div>

        {/* Resume Grid */}
        {resumes.length === 0 ? (
          <Card className="p-12 animate-scale-in">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <div className="mb-4 animate-bounce-in">
                <FileText className="w-16 h-16 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No resumes yet</h3>
              <p className="text-muted-foreground mb-6">
                Get started by creating your first resume or uploading an existing one
              </p>
              <div className="flex gap-3">
                <Button 
                  onClick={() => window.location.href = "/dashboard/resumes/upload"}
                  variant="outline"
                  className="gap-2 hover:scale-105"
                >
                  <Upload className="w-4 h-4" />
                  Upload PDF
                </Button>
                <Button onClick={onCreateNew} className="gap-2 hover:scale-105">
                  <Plus className="w-4 h-4" />
                  Create New Resume
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resumes.map((resume, index) => (
              <Card
                key={resume.id}
                className="card-hover cursor-pointer group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="group-hover:bg-accent/5 transition-colors duration-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1 group-hover:text-primary transition-colors duration-200">
                        {resume.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-2">
                        <Calendar className="w-3 h-3 opacity-60" />
                        <span className="text-xs">Updated {formatDate(resume.updatedAt)}</span>
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
                      className="flex-1 gap-2 group/btn"
                    >
                      <Edit className="w-4 h-4 group-hover/btn:rotate-12 transition-transform duration-200" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setResumeToDelete(resume.id)
                        setDeleteDialogOpen(true)
                      }}
                      className="group/btn"
                    >
                      <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200" />
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

