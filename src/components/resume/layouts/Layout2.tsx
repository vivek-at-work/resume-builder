"use client"

import type { ResumeFormData } from "@/lib/resumeSchema"
import { SelectableText } from "../SelectableText"

interface Layout2Props {
  formData: ResumeFormData
  onTextSelect: (text: string, sectionType: string, sectionId?: string) => void
  onAccept: (improvedText: string) => void
}

export function Layout2({ formData, onTextSelect, onAccept }: Layout2Props) {
  return (
    <div className="w-full space-y-5">
      {/* Header Section - Centered */}
      <header className="text-center border-b-2 border-gray-800 pb-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          {formData.personalInfo?.fullName || "Your Name"}
        </h1>
        <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-700">
          {formData.personalInfo?.email && (
            <span>{formData.personalInfo.email}</span>
          )}
          {formData.personalInfo?.phone && (
            <span>• {formData.personalInfo.phone}</span>
          )}
          {formData.personalInfo?.location && (
            <span>• {formData.personalInfo.location}</span>
          )}
        </div>
        {(formData.personalInfo?.linkedIn || formData.personalInfo?.portfolio) && (
          <div className="flex flex-wrap justify-center gap-3 mt-2 text-sm text-blue-600">
            {formData.personalInfo?.linkedIn && (
              <a href={formData.personalInfo.linkedIn} target="_blank" rel="noopener noreferrer" className="hover:underline">
                LinkedIn
              </a>
            )}
            {formData.personalInfo?.portfolio && (
              <a href={formData.personalInfo.portfolio} target="_blank" rel="noopener noreferrer" className="hover:underline">
                Portfolio
              </a>
            )}
          </div>
        )}
      </header>

      {/* Professional Summary */}
      {formData.professionalSummary && (
        <section>
          <SelectableText
            sectionType="heading"
            sectionId="professionalSummary-heading"
            onSelect={onTextSelect}
            onAccept={onAccept}
          >
            <h2 className="text-lg font-bold text-gray-900 uppercase border-b border-gray-400 pb-1 mb-2">
              Professional Summary
            </h2>
          </SelectableText>
          <SelectableText
            sectionType="summary"
            sectionId="professionalSummary"
            onSelect={onTextSelect}
            onAccept={onAccept}
          >
            <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">
              {formData.professionalSummary}
            </p>
          </SelectableText>
        </section>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-5">
          {/* Work Experience */}
          {formData.workExperience && formData.workExperience.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-gray-900 uppercase border-b border-gray-400 pb-1 mb-2">
                Experience
              </h2>
              <div className="space-y-3">
                {formData.workExperience.map((exp, index) => (
                  <div key={index} className="space-y-1">
                    <h3 className="font-semibold text-gray-900 text-base">
                      {exp.position || "Position"}
                    </h3>
                    <p className="text-gray-700 text-sm font-medium">
                      {exp.company || "Company Name"}
                    </p>
                    <p className="text-xs text-gray-600">
                      {exp.startDate || "Start Date"}
                      {exp.current ? (
                        " - Present"
                      ) : exp.endDate ? (
                        ` - ${exp.endDate}`
                      ) : null}
                    </p>
                    {exp.description && (
                      <SelectableText
                        sectionType="description"
                        sectionId={`workExp-${index}`}
                        onSelect={onTextSelect}
                        onAccept={onAccept}
                      >
                        <p className="text-gray-700 text-xs leading-relaxed mt-1 whitespace-pre-wrap">
                          {exp.description}
                        </p>
                      </SelectableText>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Education */}
          {formData.education && formData.education.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-gray-900 uppercase border-b border-gray-400 pb-1 mb-2">
                Education
              </h2>
              <div className="space-y-3">
                {formData.education.map((edu, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {edu.degree || "Degree"}
                    </h3>
                    <p className="text-gray-700 text-xs">{edu.field || "Field of Study"}</p>
                    <p className="text-gray-600 text-xs">{edu.institution || "Institution"}</p>
                    <p className="text-gray-600 text-xs mt-1">
                      {edu.graduationDate || "Graduation Date"}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {(formData.skills?.technical || formData.skills?.soft) && (
            <section>
              <h2 className="text-lg font-bold text-gray-900 uppercase border-b border-gray-400 pb-1 mb-2">
                Skills
              </h2>
              <div className="space-y-2">
                {formData.skills.technical && (
                  <div>
                    <p className="font-semibold text-gray-900 text-xs mb-1">Technical:</p>
                    <SelectableText
                      sectionType="skill"
                      sectionId="technical"
                      onSelect={onTextSelect}
                      onAccept={onAccept}
                    >
                      <p className="text-gray-700 text-xs">{formData.skills.technical}</p>
                    </SelectableText>
                  </div>
                )}
                {formData.skills.soft && (
                  <div>
                    <p className="font-semibold text-gray-900 text-xs mb-1">Soft:</p>
                    <SelectableText
                      sectionType="skill"
                      sectionId="soft"
                      onSelect={onTextSelect}
                      onAccept={onAccept}
                    >
                      <p className="text-gray-700 text-xs">{formData.skills.soft}</p>
                    </SelectableText>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Empty State */}
      {!formData.personalInfo?.fullName && 
       !formData.professionalSummary && 
       (!formData.workExperience || formData.workExperience.length === 0) && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">Start filling out the form to see your resume preview</p>
        </div>
      )}
    </div>
  )
}

