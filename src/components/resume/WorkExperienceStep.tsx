"use client"

import type { UseFormRegister, FieldErrors, UseFormWatch, Control } from "react-hook-form"
import { useFieldArray } from "react-hook-form"
import { Button } from "@/components/ui/button"
import type { ResumeFormData } from "@/lib/resumeSchema"
import { WorkExperienceItem } from "./WorkExperienceItem"

interface WorkExperienceStepProps {
  register: UseFormRegister<ResumeFormData>
  errors: FieldErrors<ResumeFormData>
  watch: UseFormWatch<ResumeFormData>
  control: Control<ResumeFormData>
}

export function WorkExperienceStep({
  register,
  errors,
  watch,
  control,
}: WorkExperienceStepProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "workExperience",
  })

  return (
    <div className="space-y-6">
      {fields.map((field, index) => (
        <WorkExperienceItem
          key={field.id}
          field={field}
          index={index}
          register={register}
          errors={errors}
          watch={watch}
          onRemove={() => remove(index)}
          canRemove={fields.length > 1}
        />
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() =>
          append({
            company: "",
            position: "",
            startDate: "",
            endDate: "",
            current: false,
            description: "",
          })
        }
      >
        + Add Another Experience
      </Button>
    </div>
  )
}

