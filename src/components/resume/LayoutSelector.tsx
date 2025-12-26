"use client"

import { useRef } from "react"
import { cn } from "@/lib/utils"
import type { ResumeFormData } from "@/lib/resumeSchema"
import { dummyResumeData } from "@/lib/dummyResumeData"
import { Layout1 } from "./layouts/Layout1"
import { Layout2 } from "./layouts/Layout2"
import { Layout3 } from "./layouts/Layout3"
import { PDFExport } from "./PDFExport"

export type LayoutType = "layout1" | "layout2" | "layout3"

interface LayoutSelectorProps {
  selectedLayout: LayoutType
  onLayoutChange: (layout: LayoutType) => void
  formData: ResumeFormData
  onTextSelect: (text: string, sectionType: string, sectionId?: string) => void
  onAccept: (improvedText: string) => void
}

const layouts = [
  { id: "layout1" as LayoutType, name: "Classic", component: Layout1 },
  { id: "layout2" as LayoutType, name: "Modern", component: Layout2 },
  { id: "layout3" as LayoutType, name: "Sidebar", component: Layout3 },
]

export function LayoutSelector({ selectedLayout, onLayoutChange, formData, onTextSelect, onAccept }: LayoutSelectorProps) {
  const SelectedLayoutComponent = layouts.find(l => l.id === selectedLayout)?.component || Layout1
  const resumeContentRef = useRef<HTMLDivElement>(null)
  
  // Merge form data with dummy data - prioritize form data when it exists and is not empty, otherwise use dummy data
  const mergeData = (): ResumeFormData => {
    const hasValue = (value: string | undefined): boolean => {
      return value !== undefined && value !== null && value.trim() !== ""
    }
    
    const hasWorkExperience = formData.workExperience && 
      formData.workExperience.length > 0 && 
      hasValue(formData.workExperience[0].company)
    
    const hasEducation = formData.education && 
      formData.education.length > 0 && 
      hasValue(formData.education[0].institution)
    
    const merged: ResumeFormData = {
      personalInfo: {
        fullName: hasValue(formData.personalInfo?.fullName) 
          ? formData.personalInfo.fullName 
          : dummyResumeData.personalInfo.fullName,
        email: hasValue(formData.personalInfo?.email) 
          ? formData.personalInfo.email 
          : dummyResumeData.personalInfo.email,
        phone: hasValue(formData.personalInfo?.phone) 
          ? formData.personalInfo.phone 
          : dummyResumeData.personalInfo.phone,
        location: hasValue(formData.personalInfo?.location) 
          ? formData.personalInfo.location 
          : dummyResumeData.personalInfo.location,
        linkedIn: hasValue(formData.personalInfo?.linkedIn) 
          ? formData.personalInfo.linkedIn 
          : dummyResumeData.personalInfo.linkedIn,
        portfolio: hasValue(formData.personalInfo?.portfolio) 
          ? formData.personalInfo.portfolio 
          : dummyResumeData.personalInfo.portfolio,
      },
      professionalSummary: hasValue(formData.professionalSummary) 
        ? formData.professionalSummary 
        : dummyResumeData.professionalSummary,
      workExperience: hasWorkExperience 
        ? formData.workExperience 
        : dummyResumeData.workExperience,
      education: hasEducation 
        ? formData.education 
        : dummyResumeData.education,
      skills: {
        technical: hasValue(formData.skills?.technical) 
          ? formData.skills.technical 
          : dummyResumeData.skills.technical,
        soft: hasValue(formData.skills?.soft) 
          ? formData.skills.soft 
          : dummyResumeData.skills.soft,
      },
    }
    return merged
  }
  
  const displayData: ResumeFormData = mergeData()
  
  // Generate filename from user's name or default
  const fileName = displayData.personalInfo?.fullName 
    ? `${displayData.personalInfo.fullName.replace(/\s+/g, "_")}_Resume`
    : "resume"

  return (
    <div className="h-full flex flex-col">
      {/* Thumbnail Selector - 10% height */}
      <div className="h-[10%] min-h-[60px] border-b bg-gray-50 p-2 flex items-center gap-2 overflow-x-auto">
        <span className="text-xs font-semibold text-gray-600 whitespace-nowrap px-2">Layout:</span>
        {layouts.map((layout) => (
          <button
            key={layout.id}
            type="button"
            onClick={() => onLayoutChange(layout.id)}
            className={cn(
              "flex-shrink-0 relative border-2 rounded transition-all hover:shadow-md",
              "h-full aspect-[8.5/11] min-w-[50px]",
              selectedLayout === layout.id
                ? "border-blue-500 bg-blue-50 shadow-sm ring-2 ring-blue-200"
                : "border-gray-300 bg-white hover:border-gray-400"
            )}
          >
            {/* Thumbnail Preview */}
            <div className="h-full p-1 overflow-hidden">
              {layout.id === "layout1" && (
                <div className="h-full flex flex-col gap-0.5">
                  <div className="h-2 bg-gray-800 rounded"></div>
                  <div className="h-1 bg-gray-400 rounded w-full"></div>
                  <div className="h-1 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-1 bg-gray-300 rounded w-2/3"></div>
                  <div className="h-0.5 bg-gray-200 rounded w-full mt-1"></div>
                  <div className="h-1 bg-gray-300 rounded w-full"></div>
                  <div className="h-1 bg-gray-300 rounded w-5/6"></div>
                </div>
              )}
              {layout.id === "layout2" && (
                <div className="h-full flex flex-col gap-0.5">
                  <div className="h-2.5 bg-gray-800 rounded text-center"></div>
                  <div className="h-1 bg-gray-300 rounded w-full"></div>
                  <div className="h-0.5 bg-gray-200 rounded w-full"></div>
                  <div className="grid grid-cols-2 gap-1 flex-1">
                    <div className="space-y-0.5">
                      <div className="h-1 bg-gray-300 rounded w-full"></div>
                      <div className="h-0.5 bg-gray-200 rounded w-full"></div>
                    </div>
                    <div className="space-y-0.5">
                      <div className="h-1 bg-gray-300 rounded w-full"></div>
                      <div className="h-0.5 bg-gray-200 rounded w-full"></div>
                    </div>
                  </div>
                </div>
              )}
              {layout.id === "layout3" && (
                <div className="h-full grid grid-cols-3 gap-0.5">
                  <div className="bg-gray-200 rounded p-0.5 space-y-0.5">
                    <div className="h-1.5 bg-gray-800 rounded"></div>
                    <div className="h-0.5 bg-gray-400 rounded w-full"></div>
                    <div className="h-0.5 bg-gray-300 rounded w-full"></div>
                  </div>
                  <div className="col-span-2 space-y-0.5">
                    <div className="h-1 bg-gray-300 rounded w-full"></div>
                    <div className="h-0.5 bg-gray-200 rounded w-full"></div>
                    <div className="h-1 bg-gray-300 rounded w-full"></div>
                    <div className="h-0.5 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              )}
            </div>
            {/* Label */}
            <div className="absolute -bottom-5 left-0 right-0 text-[9px] text-center text-gray-600 font-medium">
              {layout.name}
            </div>
          </button>
        ))}
      </div>

      {/* Preview Area - 90% height */}
      <div className="flex-1 overflow-y-auto bg-white p-6 relative">
        <div className="absolute top-4 right-4 z-10">
          <PDFExport 
            resumeContentRef={resumeContentRef} 
            fileName={fileName}
          />
        </div>
        <div ref={resumeContentRef} style={{ padding: "10px" }} className="print:block">
          <SelectedLayoutComponent formData={displayData} onTextSelect={onTextSelect} onAccept={onAccept} />
        </div>
      </div>
    </div>
  )
}

