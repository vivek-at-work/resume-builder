import type { UseFormRegister, FieldErrors } from "react-hook-form"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { ResumeFormData } from "@/lib/resumeSchema"

interface SkillsStepProps {
  register: UseFormRegister<ResumeFormData>
  errors: FieldErrors<ResumeFormData>
}

export function SkillsStep({ register, errors }: SkillsStepProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="technical">Technical Skills *</Label>
        <Textarea
          id="technical"
          {...register("skills.technical")}
          placeholder="e.g., JavaScript, React, Node.js, Python, SQL, Git, AWS"
          rows={4}
          className={errors.skills?.technical ? "border-destructive" : ""}
        />
        {errors.skills?.technical && (
          <p className="text-sm text-destructive">{errors.skills.technical.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          List your technical skills separated by commas
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="soft">Soft Skills</Label>
        <Textarea
          id="soft"
          {...register("skills.soft")}
          placeholder="e.g., Leadership, Communication, Problem-solving, Teamwork"
          rows={3}
        />
        <p className="text-xs text-muted-foreground">
          List your soft skills separated by commas (optional)
        </p>
      </div>
    </div>
  )
}

