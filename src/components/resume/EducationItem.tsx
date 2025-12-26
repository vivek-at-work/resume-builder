import type { UseFormRegister, FieldErrors, FieldArrayWithId } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import type { ResumeFormData } from "@/lib/resumeSchema"

interface EducationItemProps {
  field: FieldArrayWithId<ResumeFormData, "education", "id">
  index: number
  register: UseFormRegister<ResumeFormData>
  errors: FieldErrors<ResumeFormData>
  onRemove: () => void
  canRemove: boolean
}

export function EducationItem({
  field,
  index,
  register,
  errors,
  onRemove,
  canRemove,
}: EducationItemProps) {
  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Education #{index + 1}</h3>
          {canRemove && (
            <Button type="button" variant="destructive" size="sm" onClick={onRemove}>
              Remove
            </Button>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor={`institution-${index}`}>Institution *</Label>
          <Input
            id={`institution-${index}`}
            {...register(`education.${index}.institution`)}
            placeholder="University/School Name"
            className={errors.education?.[index]?.institution ? "border-destructive" : ""}
          />
          {errors.education?.[index]?.institution && (
            <p className="text-sm text-destructive">
              {errors.education[index]?.institution?.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`degree-${index}`}>Degree *</Label>
            <Input
              id={`degree-${index}`}
              {...register(`education.${index}.degree`)}
              placeholder="Bachelor's, Master's, etc."
              className={errors.education?.[index]?.degree ? "border-destructive" : ""}
            />
            {errors.education?.[index]?.degree && (
              <p className="text-sm text-destructive">
                {errors.education[index]?.degree?.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`field-${index}`}>Field of Study *</Label>
            <Input
              id={`field-${index}`}
              {...register(`education.${index}.field`)}
              placeholder="Computer Science, Business, etc."
              className={errors.education?.[index]?.field ? "border-destructive" : ""}
            />
            {errors.education?.[index]?.field && (
              <p className="text-sm text-destructive">
                {errors.education[index]?.field?.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`graduationDate-${index}`}>Graduation Date *</Label>
          <Input
            id={`graduationDate-${index}`}
            type="month"
            {...register(`education.${index}.graduationDate`)}
            className={errors.education?.[index]?.graduationDate ? "border-destructive" : ""}
          />
          {errors.education?.[index]?.graduationDate && (
            <p className="text-sm text-destructive">
              {errors.education[index]?.graduationDate?.message}
            </p>
          )}
        </div>
      </div>
    </Card>
  )
}

