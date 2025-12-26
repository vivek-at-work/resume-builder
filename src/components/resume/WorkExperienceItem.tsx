import type { UseFormRegister, FieldErrors, UseFormWatch, FieldArrayWithId } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import type { ResumeFormData } from "@/lib/resumeSchema"

interface WorkExperienceItemProps {
  field: FieldArrayWithId<ResumeFormData, "workExperience", "id">
  index: number
  register: UseFormRegister<ResumeFormData>
  errors: FieldErrors<ResumeFormData>
  watch: UseFormWatch<ResumeFormData>
  onRemove: () => void
  canRemove: boolean
}

export function WorkExperienceItem({
  field,
  index,
  register,
  errors,
  watch,
  onRemove,
  canRemove,
}: WorkExperienceItemProps) {
  const isCurrent = watch(`workExperience.${index}.current`)

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Experience #{index + 1}</h3>
          {canRemove && (
            <Button type="button" variant="destructive" size="sm" onClick={onRemove}>
              Remove
            </Button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`company-${index}`}>Company *</Label>
            <Input
              id={`company-${index}`}
              {...register(`workExperience.${index}.company`)}
              placeholder="Company Name"
              className={errors.workExperience?.[index]?.company ? "border-destructive" : ""}
            />
            {errors.workExperience?.[index]?.company && (
              <p className="text-sm text-destructive">
                {errors.workExperience[index]?.company?.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`position-${index}`}>Position *</Label>
            <Input
              id={`position-${index}`}
              {...register(`workExperience.${index}.position`)}
              placeholder="Job Title"
              className={errors.workExperience?.[index]?.position ? "border-destructive" : ""}
            />
            {errors.workExperience?.[index]?.position && (
              <p className="text-sm text-destructive">
                {errors.workExperience[index]?.position?.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`startDate-${index}`}>Start Date *</Label>
            <Input
              id={`startDate-${index}`}
              type="month"
              {...register(`workExperience.${index}.startDate`)}
              className={errors.workExperience?.[index]?.startDate ? "border-destructive" : ""}
            />
            {errors.workExperience?.[index]?.startDate && (
              <p className="text-sm text-destructive">
                {errors.workExperience[index]?.startDate?.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`endDate-${index}`}>End Date</Label>
            <Input
              id={`endDate-${index}`}
              type="month"
              {...register(`workExperience.${index}.endDate`)}
              disabled={isCurrent}
              className={errors.workExperience?.[index]?.endDate ? "border-destructive" : ""}
            />
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`current-${index}`}
                {...register(`workExperience.${index}.current`)}
                className="rounded"
              />
              <Label htmlFor={`current-${index}`} className="cursor-pointer">
                Currently working here
              </Label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`description-${index}`}>Job Description *</Label>
          <Textarea
            id={`description-${index}`}
            {...register(`workExperience.${index}.description`)}
            placeholder="Describe your responsibilities and achievements..."
            rows={4}
            className={errors.workExperience?.[index]?.description ? "border-destructive" : ""}
          />
          {errors.workExperience?.[index]?.description && (
            <p className="text-sm text-destructive">
              {errors.workExperience[index]?.description?.message}
            </p>
          )}
        </div>
      </div>
    </Card>
  )
}

