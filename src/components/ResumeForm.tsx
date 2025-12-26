"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  resumeSchema,
  STEPS,
  defaultFormValues,
} from "@/lib/resumeSchema"
import type { ResumeFormData } from "@/lib/resumeSchema"
import { PersonalInfoStep } from "./resume/PersonalInfoStep"
import { ProfessionalSummaryStep } from "./resume/ProfessionalSummaryStep"
import { WorkExperienceStep } from "./resume/WorkExperienceStep"
import { EducationStep } from "./resume/EducationStep"
import { SkillsStep } from "./resume/SkillsStep"
import { ReviewStep } from "./resume/ReviewStep"
import { StepNavigation } from "./resume/StepNavigation"
import { LayoutSelector, type LayoutType } from "./resume/LayoutSelector"
import { Save, ArrowLeft, CheckCircle2, Upload, Undo2 } from "lucide-react"
import { PDFUpload } from "./resume/PDFUpload"
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"

interface ResumeFormProps {
  resumeId?: string | null
  onBack?: () => void
  onSave?: () => void
}

export function ResumeForm({ resumeId, onBack, onSave }: ResumeFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedLayout, setSelectedLayout] = useState<LayoutType>("layout1")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true)
  const [showPDFUpload, setShowPDFUpload] = useState(false)
  const [currentResumeId, setCurrentResumeId] = useState<string | null>(resumeId || null)
  const [currentSectionInfo, setCurrentSectionInfo] = useState<{
    sectionType: string
    sectionId?: string
  } | null>(null)
  const [lastChange, setLastChange] = useState<{
    previousValue: string
    sectionType: string
    sectionId?: string
  } | null>(null)
  const { toast } = useToast()
  const totalSteps = STEPS.length
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastSavedDataRef = useRef<string>("")

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    trigger,
    watch,
    reset,
    setValue,
  } = useForm<ResumeFormData>({
    resolver: yupResolver(resumeSchema) as any,
    mode: "onChange",
    defaultValues: defaultFormValues,
  })

  const formData = watch()
  const progress = (currentStep / totalSteps) * 100

  // Generate title from user's name or use default
  const generateTitle = useCallback((data: ResumeFormData): string => {
    const name = data.personalInfo?.fullName?.trim()
    if (name) {
      return `${name}'s Resume`
    }
    return "Untitled Resume"
  }, [])

  // Load resume data when editing
  useEffect(() => {
    const loadResume = async () => {
      if (!resumeId) {
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const response = await fetch(`/api/resumes/${resumeId}`)
        if (!response.ok) {
          throw new Error("Failed to load resume")
        }

        const resume = await response.json()
        
        // Populate form with resume data
        const formData: ResumeFormData = {
          personalInfo: resume.personalInfo || defaultFormValues.personalInfo,
          professionalSummary: resume.professionalSummary || "",
          workExperience: resume.workExperience || defaultFormValues.workExperience,
          education: resume.education || defaultFormValues.education,
          skills: resume.skills || defaultFormValues.skills,
        }

        reset(formData)
        setSelectedLayout((resume.layout as LayoutType) || "layout1")
        setCurrentResumeId(resume.id)
        
        // Update last saved data reference
        lastSavedDataRef.current = JSON.stringify({
          formData,
          selectedLayout: resume.layout || "layout1",
        })
      } catch (error) {
        console.error("Error loading resume:", error)
        toast({
          title: "Failed to load resume",
          description: "Could not load resume data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadResume()
  }, [resumeId, reset, toast])

  const saveDraft = useCallback(async (showNotification = false) => {
    if (saving) return

    setSaving(true)
    setAutoSaveEnabled(false) // Temporarily disable auto-save during save

    try {
      const currentFormData = watch()
      const title = generateTitle(currentFormData)
      
      const resumeData = {
        title,
        layout: selectedLayout,
        isDraft: true,
        personalInfo: currentFormData.personalInfo,
        professionalSummary: currentFormData.professionalSummary,
        workExperience: currentFormData.workExperience,
        education: currentFormData.education,
        skills: currentFormData.skills,
      }

      if (currentResumeId) {
        // Update existing resume
        const response = await fetch(`/api/resumes/${currentResumeId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(resumeData),
        })
        if (response.ok) {
          if (showNotification) {
            setSaved(true)
            setTimeout(() => setSaved(false), 2000)
          }
        }
      } else {
        // Create new resume
        const response = await fetch("/api/resumes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(resumeData),
        })
        if (response.ok) {
          const savedResume = await response.json()
          setCurrentResumeId(savedResume.id)
          // Update the URL if we're creating a new resume
          if (typeof window !== "undefined" && window.location.pathname === "/dashboard/resumes/new") {
            window.history.replaceState(null, "", `/dashboard/resumes/${savedResume.id}/edit`)
          }
          if (showNotification) {
            setSaved(true)
            setTimeout(() => setSaved(false), 2000)
          }
        }
      }

      // Update last saved data reference
      lastSavedDataRef.current = JSON.stringify({
        formData: currentFormData,
        selectedLayout,
      })
    } catch (error) {
      console.error("Error saving draft:", error)
    } finally {
      setSaving(false)
      setAutoSaveEnabled(true) // Re-enable auto-save
    }
  }, [saving, watch, selectedLayout, generateTitle, currentResumeId])

  const validateStep = async (step: number) => {
    let fieldsToValidate: (keyof ResumeFormData)[] = []

    switch (step) {
      case 1:
        fieldsToValidate = ["personalInfo"]
        break
      case 2:
        fieldsToValidate = ["professionalSummary"]
        break
      case 3:
        fieldsToValidate = ["workExperience"]
        break
      case 4:
        fieldsToValidate = ["education"]
        break
      case 5:
        fieldsToValidate = ["skills"]
        break
      default:
        return true
    }

    const isValid = await trigger(fieldsToValidate)
    return isValid
  }

  const nextStep = async () => {
    const isValid = await validateStep(currentStep)
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSaveDraft = async () => {
    await saveDraft(true)
  }

  const handleParseComplete = async (parsedData: ResumeFormData) => {
    // Reset form with parsed data
    reset(parsedData)
    setShowPDFUpload(false)
    
    // Automatically save the parsed resume
    try {
      const title = generateTitle(parsedData)
      
      const resumeData = {
        title,
        layout: selectedLayout,
        isDraft: true,
        personalInfo: parsedData.personalInfo,
        professionalSummary: parsedData.professionalSummary,
        workExperience: parsedData.workExperience,
        education: parsedData.education,
        skills: parsedData.skills,
      }

      // Create new resume from parsed data
      const response = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resumeData),
      })
      
      if (response.ok) {
        const savedResume = await response.json()
        setCurrentResumeId(savedResume.id)
        
        // Update the URL if we're creating a new resume
        if (typeof window !== "undefined" && window.location.pathname === "/dashboard/resumes/new") {
          window.history.replaceState(null, "", `/dashboard/resumes/${savedResume.id}/edit`)
        }
        
        // Show success notification
        toast({
          title: "Resume parsed and saved",
          description: "Your resume has been parsed and saved successfully.",
          duration: 3000,
        })
      } else {
        throw new Error("Failed to save parsed resume")
      }
      
      // Update last saved data reference
      lastSavedDataRef.current = JSON.stringify({
        formData: parsedData,
        selectedLayout,
      })
    } catch (error) {
      console.error("Error saving parsed resume:", error)
      toast({
        title: "Parsed but not saved",
        description: "Resume was parsed but failed to save. Please save manually.",
        duration: 5000,
      })
    }
  }

  const handleTextSelect = (text: string, sectionType: string, sectionId?: string) => {
    console.log("Text selected:", { text, sectionType, sectionId })
    // Store section info for use in handleTextImprove
    setCurrentSectionInfo({ sectionType, sectionId })
  }

  const handleTextImprove = (improvedText: string) => {
    if (!currentSectionInfo) return
    
    const { sectionType, sectionId } = currentSectionInfo
    
    // Update form data based on section type and ID
    const currentData = watch()
    let previousValue = ""
    
    // Get the previous value before updating and use setValue for immediate updates
    if (sectionType === "summary" && sectionId === "professionalSummary") {
      previousValue = currentData.professionalSummary || ""
      setValue("professionalSummary", improvedText, { shouldDirty: true, shouldValidate: true })
    } else if (sectionType === "description" && sectionId?.startsWith("workExp-")) {
      const index = parseInt(sectionId.split("-")[1] || "0")
      const currentWorkExp = currentData.workExperience || []
      if (currentWorkExp[index]) {
        previousValue = currentWorkExp[index].description || ""
        setValue(`workExperience.${index}.description`, improvedText, { shouldDirty: true, shouldValidate: true })
      }
    } else if (sectionType === "statement" && sectionId?.startsWith("workExp-")) {
      const index = parseInt(sectionId.split("-")[1] || "0")
      const currentWorkExp = currentData.workExperience || []
      if (currentWorkExp[index]) {
        // For statements, update the description field
        previousValue = currentWorkExp[index].description || ""
        setValue(`workExperience.${index}.description`, improvedText, { shouldDirty: true, shouldValidate: true })
      }
    } else if (sectionType === "skill" && sectionId === "technical") {
      previousValue = currentData.skills?.technical || ""
      setValue("skills.technical", improvedText, { shouldDirty: true, shouldValidate: true })
    } else if (sectionType === "skill" && sectionId === "soft") {
      previousValue = currentData.skills?.soft || ""
      setValue("skills.soft", improvedText, { shouldDirty: true, shouldValidate: true })
    }
    
    // Store the change for undo
    if (previousValue !== improvedText) {
      setLastChange({
        previousValue,
        sectionType,
        sectionId,
      })
      
      // Show toast with undo option
      toast({
        title: "Text updated",
        description: "Your resume text has been updated with the AI suggestion.",
        action: (
          <ToastAction altText="Undo change" onClick={handleUndo} className="gap-1">
            <Undo2 className="w-3 h-3" />
            Undo
          </ToastAction>
        ),
        duration: 5000,
      })
    }
    
    setCurrentSectionInfo(null)
  }

  const handleUndo = () => {
    if (!lastChange) return
    
    const { previousValue, sectionType, sectionId } = lastChange
    
    // Revert the change using setValue for immediate updates
    if (sectionType === "summary" && sectionId === "professionalSummary") {
      setValue("professionalSummary", previousValue, { shouldDirty: true, shouldValidate: true })
    } else if (sectionType === "description" && sectionId?.startsWith("workExp-")) {
      const index = parseInt(sectionId.split("-")[1] || "0")
      setValue(`workExperience.${index}.description`, previousValue, { shouldDirty: true, shouldValidate: true })
    } else if (sectionType === "statement" && sectionId?.startsWith("workExp-")) {
      const index = parseInt(sectionId.split("-")[1] || "0")
      setValue(`workExperience.${index}.description`, previousValue, { shouldDirty: true, shouldValidate: true })
    } else if (sectionType === "skill" && sectionId === "technical") {
      setValue("skills.technical", previousValue, { shouldDirty: true, shouldValidate: true })
    } else if (sectionType === "skill" && sectionId === "soft") {
      setValue("skills.soft", previousValue, { shouldDirty: true, shouldValidate: true })
    }
    
    // Clear the undo history
    setLastChange(null)
    
    // Show confirmation toast
    toast({
      title: "Change reverted",
      description: "Your text has been restored to the previous version.",
      duration: 3000,
    })
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep register={register} errors={errors} />

      case 2:
        return (
          <ProfessionalSummaryStep
            register={register}
            errors={errors}
            watch={watch}
          />
        )

      case 3:
        return (
          <WorkExperienceStep
            register={register}
            errors={errors}
            watch={watch}
            control={control}
          />
        )

      case 4:
        return (
          <EducationStep register={register} errors={errors} control={control} />
        )

      case 5:
        return <SkillsStep register={register} errors={errors} />

      case 6:
        return <ReviewStep formData={formData} />

      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading resume...</p>
      </div>
    )
  }

  // Show PDF upload option on first step if no resumeId and showing upload
  if (showPDFUpload && !resumeId) {
    return (
      <div className="w-full h-[calc(100vh-12rem)] flex gap-4">
        <div className="w-[30%]">
          <PDFUpload
            onParseComplete={handleParseComplete}
            onCancel={() => setShowPDFUpload(false)}
          />
        </div>
        <div className="w-[70%] flex items-center justify-center border rounded-lg bg-gray-50">
          <p className="text-muted-foreground">Upload a PDF to get started</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-[calc(100vh-12rem)] flex gap-4">
      {/* Left Column - Form (30%) */}
      <div className="w-[30%] overflow-y-auto">
        <Card className="h-full">
          <CardHeader className="sticky top-0 bg-background z-10 border-b">
            <div className="flex items-center gap-2 mb-2">
              {onBack && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                  className="p-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              <CardTitle className="flex-1">Create Your ATS-Friendly Resume</CardTitle>
            </div>
            <div className="space-y-2">
              {!resumeId && currentStep === 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPDFUpload(true)}
                  className="w-full gap-2 mb-2"
                >
                  <Upload className="w-4 h-4" />
                  Upload PDF Resume
                </Button>
              )}
              <div className="flex items-center justify-between">
                <CardDescription>
                  Step {currentStep} of {totalSteps}: {STEPS[currentStep - 1].title}
                </CardDescription>
                {saved && (
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Saved</span>
                  </div>
                )}
                {saving && !saved && (
                  <div className="text-sm text-muted-foreground">
                    Saving...
                  </div>
                )}
              </div>
              <Progress value={progress} className="mt-2" />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <form>
              <div className="space-y-6">
                {renderStep()}

                <div className="space-y-3">
                  {/* Save as Draft Button - Always Visible */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSaveDraft}
                    disabled={saving}
                    className="w-full gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? "Saving..." : "Save as Draft"}
                  </Button>

                  {/* Step Navigation */}
                  <StepNavigation
                    currentStep={currentStep}
                    totalSteps={totalSteps}
                    onPrevious={prevStep}
                    onNext={nextStep}
                  />
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Preview (70%) */}
      <div className="w-[70%] overflow-hidden border rounded-lg bg-gray-50">
        <LayoutSelector
          selectedLayout={selectedLayout}
          onLayoutChange={setSelectedLayout}
          formData={formData}
          onTextSelect={handleTextSelect}
          onAccept={handleTextImprove}
        />
      </div>

    </div>
  )
}
