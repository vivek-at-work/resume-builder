import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { ResumeFormData } from "@/lib/resumeSchema"

interface ReviewStepProps {
  formData: ResumeFormData
}

export function ReviewStep({ formData }: ReviewStepProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <strong>Name:</strong> {formData.personalInfo?.fullName}
          </p>
          <p>
            <strong>Email:</strong> {formData.personalInfo?.email}
          </p>
          <p>
            <strong>Phone:</strong> {formData.personalInfo?.phone}
          </p>
          <p>
            <strong>Location:</strong> {formData.personalInfo?.location}
          </p>
          {formData.personalInfo?.linkedIn && (
            <p>
              <strong>LinkedIn:</strong> {formData.personalInfo.linkedIn}
            </p>
          )}
          {formData.personalInfo?.portfolio && (
            <p>
              <strong>Portfolio:</strong> {formData.personalInfo.portfolio}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Professional Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm whitespace-pre-wrap">{formData.professionalSummary}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Work Experience</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.workExperience?.map((exp, index) => (
            <div key={index} className="border-l-2 pl-4">
              <p className="font-semibold">
                {exp.position} at {exp.company}
              </p>
              <p className="text-sm text-muted-foreground">
                {exp.startDate} - {exp.current ? "Present" : exp.endDate || "N/A"}
              </p>
              <p className="text-sm mt-2">{exp.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Education</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {formData.education?.map((edu, index) => (
            <div key={index}>
              <p className="font-semibold">
                {edu.degree} in {edu.field}
              </p>
              <p className="text-sm text-muted-foreground">
                {edu.institution} - {edu.graduationDate}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <strong>Technical:</strong> {formData.skills?.technical}
          </p>
          {formData.skills?.soft && (
            <p>
              <strong>Soft:</strong> {formData.skills.soft}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

