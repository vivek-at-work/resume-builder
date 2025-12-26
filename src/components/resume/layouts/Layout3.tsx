"use client"

import type { ResumeFormData } from "@/lib/resumeSchema"
import { SelectableText } from "../SelectableText"

interface Layout3Props {
  formData: ResumeFormData
  onTextSelect: (text: string, sectionType: string, sectionId?: string) => void
  onAccept: (improvedText: string) => void
}

export function Layout3({ formData, onTextSelect, onAccept }: Layout3Props) {
  return (
    <div className="w-full space-y-4">
      {/* Header Section - Sidebar Style */}
      <div className="flex gap-6">
        <div className="w-1/3 bg-gray-100 p-4 space-y-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              {formData.personalInfo?.fullName || "Your Name"}
            </h1>
            <div className="space-y-2 text-sm text-gray-700">
              {formData.personalInfo?.email && (
                <p>{formData.personalInfo.email}</p>
              )}
              {formData.personalInfo?.phone && (
                <p>{formData.personalInfo.phone}</p>
              )}
              {formData.personalInfo?.location && (
                <p>{formData.personalInfo.location}</p>
              )}
            </div>
            {(formData.personalInfo?.linkedIn || formData.personalInfo?.portfolio) && (
              <div className="mt-3 space-y-1">
                {formData.personalInfo?.linkedIn && (
                  <a href={formData.personalInfo.linkedIn} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline block">
                    LinkedIn
                  </a>
                )}
                {formData.personalInfo?.portfolio && (
                  <a href={formData.personalInfo.portfolio} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline block">
                    Portfolio
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Skills in Sidebar */}
          {(formData.skills?.technical || formData.skills?.soft) && (
            <div className="mt-6">
              <h2 className="text-sm font-bold text-gray-900 uppercase mb-2">Skills</h2>
              {formData.skills.technical && (
                <div className="mb-2">
                  <p className="text-xs font-semibold text-gray-900 mb-1">Technical</p>
                  <SelectableText
                    sectionType="skill"
                    sectionId="technical"
            onSelect={onTextSelect}
            onAccept={onAccept}
          >
                    <p className="text-xs text-gray-700">{formData.skills.technical}</p>
                  </SelectableText>
                </div>
              )}
              {formData.skills.soft && (
                <div>
                  <p className="text-xs font-semibold text-gray-900 mb-1">Soft</p>
                  <SelectableText
                    sectionType="skill"
                    sectionId="soft"
            onSelect={onTextSelect}
            onAccept={onAccept}
          >
                    <p className="text-xs text-gray-700">{formData.skills.soft}</p>
                  </SelectableText>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="w-2/3 space-y-4">
          {/* Professional Summary */}
          {formData.professionalSummary && (
            <section>
              <SelectableText
                sectionType="heading"
                sectionId="professionalSummary-heading"
            onSelect={onTextSelect}
            onAccept={onAccept}
          >
                <h2 className="text-lg font-bold text-gray-900 uppercase border-b border-gray-300 pb-1 mb-2">
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

          {/* Work Experience */}
          {formData.workExperience && formData.workExperience.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-gray-900 uppercase border-b border-gray-300 pb-1 mb-2">
                Work Experience
              </h2>
              <div className="space-y-3">
                {formData.workExperience.map((exp, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-base">
                          {exp.position || "Position"}
                        </h3>
                        <p className="text-gray-700 text-sm">{exp.company || "Company Name"}</p>
                      </div>
                      <span className="text-xs text-gray-600">
                        {exp.startDate || "Start Date"}
                        {exp.current ? " - Present" : exp.endDate ? ` - ${exp.endDate}` : ""}
                      </span>
                    </div>
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

          {/* Education */}
          {formData.education && formData.education.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-gray-900 uppercase border-b border-gray-300 pb-1 mb-2">
                Education
              </h2>
              <div className="space-y-2">
                {formData.education.map((edu, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {edu.degree || "Degree"} in {edu.field || "Field of Study"}
                    </h3>
                    <p className="text-gray-700 text-xs">{edu.institution || "Institution"}</p>
                    <p className="text-gray-600 text-xs">{edu.graduationDate || "Graduation Date"}</p>
                  </div>
                ))}
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

