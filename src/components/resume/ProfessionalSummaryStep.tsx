import type { UseFormRegister, FieldErrors, UseFormWatch } from "react-hook-form"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { ResumeFormData } from "@/lib/resumeSchema"

interface ProfessionalSummaryStepProps {
  register: UseFormRegister<ResumeFormData>
  errors: FieldErrors<ResumeFormData>
  watch: UseFormWatch<ResumeFormData>
}

export function ProfessionalSummaryStep({
  register,
  errors,
  watch,
}: ProfessionalSummaryStepProps) {
  const summary = watch("professionalSummary")

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="summary">Professional Summary *</Label>
        <Textarea
          id="summary"
          {...register("professionalSummary")}
          placeholder="Write a brief summary of your professional experience, key achievements, and career goals. This should be 2-4 sentences."
          rows={6}
          className={errors.professionalSummary ? "border-destructive" : ""}
        />
        {errors.professionalSummary && (
          <p className="text-sm text-destructive">{errors.professionalSummary.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          {summary?.length || 0} characters (minimum 50)
        </p>
      </div>
    </div>
  )
}

