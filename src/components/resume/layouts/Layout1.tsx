"use client"

import type { ResumeFormData } from "@/lib/resumeSchema"
import { SelectableText } from "../SelectableText"

interface Layout1Props {
  formData: ResumeFormData
  onTextSelect: (text: string, sectionType: string, sectionId?: string) => void
  onAccept: (improvedText: string) => void
}

export function Layout1({ formData, onTextSelect, onAccept }: Layout1Props) {
  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <header className="border-b-2 border-gray-800 pb-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {formData.personalInfo?.fullName || "Your Name"}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-700">
          {formData.personalInfo?.email && (
            <span>{formData.personalInfo.email}</span>
          )}
          {formData.personalInfo?.phone && (
            <span>{formData.personalInfo.phone}</span>
          )}
          {formData.personalInfo?.location && (
            <span>{formData.personalInfo.location}</span>
          )}
        </div>
        <div className="flex flex-wrap gap-4 mt-2 text-sm text-blue-600">
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
            <h2 className="text-xl font-bold text-gray-900 uppercase border-b-2 border-gray-300 pb-1 mb-3">
              Professional Summary
            </h2>
          </SelectableText>
          <SelectableText
            sectionType="summary"
            sectionId="professionalSummary"
            onSelect={onTextSelect}
            onAccept={onAccept}
          >
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {formData.professionalSummary}
            </p>
          </SelectableText>
        </section>
      )}

      {/* Work Experience */}
      {formData.workExperience && formData.workExperience.length > 0 && (
        <section>
          <SelectableText
            sectionType="heading"
            sectionId="workExperience-heading"
            onSelect={onTextSelect}
            onAccept={onAccept}
          >
            <h2 className="text-xl font-bold text-gray-900 uppercase border-b-2 border-gray-300 pb-1 mb-3">
              Work Experience
            </h2>
          </SelectableText>
          <div className="space-y-4">
            {formData.workExperience.map((exp, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between items-start">
                  <div>
                    <SelectableText
                      sectionType="statement"
                      sectionId={`workExp-${index}`}
                      onSelect={onTextSelect}
                      onAccept={onAccept}
                    >
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {exp.position || "Position"}
                      </h3>
                    </SelectableText>
                    <SelectableText
                      sectionType="statement"
                      sectionId={`workExp-${index}-company`}
                      onSelect={onTextSelect}
                      onAccept={onAccept}
                    >
                      <p className="text-gray-700 font-medium">
                        {exp.company || "Company Name"}
                      </p>
                    </SelectableText>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <span>{exp.startDate || "Start Date"}</span>
                    {exp.current ? (
                      <span> - Present</span>
                    ) : exp.endDate ? (
                      <span> - {exp.endDate}</span>
                    ) : null}
                  </div>
                </div>
                {exp.description && (
                  <SelectableText
                    sectionType="description"
                    sectionId={`workExp-${index}`}
                    onSelect={onTextSelect}
                    onAccept={onAccept}
                  >
                    <p className="text-gray-700 text-sm leading-relaxed mt-2 whitespace-pre-wrap">
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
          <h2 className="text-xl font-bold text-gray-900 uppercase border-b-2 border-gray-300 pb-1 mb-3">
            Education
          </h2>
          <div className="space-y-3">
            {formData.education.map((edu, index) => (
              <div key={index} className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {edu.degree || "Degree"} in {edu.field || "Field of Study"}
                  </h3>
                  <p className="text-gray-700">{edu.institution || "Institution"}</p>
                </div>
                <span className="text-sm text-gray-600">
                  {edu.graduationDate || "Graduation Date"}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {(formData.skills?.technical || formData.skills?.soft) && (
        <section>
          <SelectableText
            sectionType="heading"
            sectionId="skills-heading"
            onSelect={onTextSelect}
            onAccept={onAccept}
          >
            <h2 className="text-xl font-bold text-gray-900 uppercase border-b-2 border-gray-300 pb-1 mb-3">
              Skills
            </h2>
          </SelectableText>
          <div className="space-y-2">
            {formData.skills.technical && (
              <div>
                <p className="font-semibold text-gray-900 text-sm mb-1">Technical Skills:</p>
                <SelectableText
                  sectionType="skill"
                  sectionId="technical"
                  onSelect={onTextSelect}
                  onAccept={onAccept}
                >
                  <p className="text-gray-700 text-sm">{formData.skills.technical}</p>
                </SelectableText>
              </div>
            )}
            {formData.skills.soft && (
              <div>
                <p className="font-semibold text-gray-900 text-sm mb-1">Soft Skills:</p>
                <SelectableText
                  sectionType="skill"
                  sectionId="soft"
                  onSelect={onTextSelect}
                  onAccept={onAccept}
                >
                  <p className="text-gray-700 text-sm">{formData.skills.soft}</p>
                </SelectableText>
              </div>
            )}
          </div>
        </section>
      )}

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

