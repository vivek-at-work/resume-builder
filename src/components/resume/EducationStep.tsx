"use client"

import type { UseFormRegister, FieldErrors, Control } from "react-hook-form"
import { useFieldArray } from "react-hook-form"
import { Button } from "@/components/ui/button"
import type { ResumeFormData } from "@/lib/resumeSchema"
import { EducationItem } from "./EducationItem"

interface EducationStepProps {
  register: UseFormRegister<ResumeFormData>
  errors: FieldErrors<ResumeFormData>
  control: Control<ResumeFormData>
}

export function EducationStep({ register, errors, control }: EducationStepProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "education",
  })

  return (
    <div className="space-y-6">
      {fields.map((field, index) => (
        <EducationItem
          key={field.id}
          field={field}
          index={index}
          register={register}
          errors={errors}
          onRemove={() => remove(index)}
          canRemove={fields.length > 1}
        />
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() =>
          append({
            institution: "",
            degree: "",
            field: "",
            graduationDate: "",
          })
        }
      >
        + Add Another Education
      </Button>
    </div>
  )
}

