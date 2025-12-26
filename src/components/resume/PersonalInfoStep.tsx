import type { UseFormRegister, FieldErrors } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ResumeFormData } from "@/lib/resumeSchema"

interface PersonalInfoStepProps {
  register: UseFormRegister<ResumeFormData>
  errors: FieldErrors<ResumeFormData>
}

export function PersonalInfoStep({ register, errors }: PersonalInfoStepProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name *</Label>
        <Input
          id="fullName"
          {...register("personalInfo.fullName")}
          placeholder="John Doe"
          className={errors.personalInfo?.fullName ? "border-destructive" : ""}
        />
        {errors.personalInfo?.fullName && (
          <p className="text-sm text-destructive">{errors.personalInfo.fullName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          {...register("personalInfo.email")}
          placeholder="john.doe@email.com"
          className={errors.personalInfo?.email ? "border-destructive" : ""}
        />
        {errors.personalInfo?.email && (
          <p className="text-sm text-destructive">{errors.personalInfo.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone *</Label>
        <Input
          id="phone"
          type="tel"
          {...register("personalInfo.phone")}
          placeholder="+1 (555) 123-4567"
          className={errors.personalInfo?.phone ? "border-destructive" : ""}
        />
        {errors.personalInfo?.phone && (
          <p className="text-sm text-destructive">{errors.personalInfo.phone.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location *</Label>
        <Input
          id="location"
          {...register("personalInfo.location")}
          placeholder="City, State/Country"
          className={errors.personalInfo?.location ? "border-destructive" : ""}
        />
        {errors.personalInfo?.location && (
          <p className="text-sm text-destructive">{errors.personalInfo.location.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="linkedIn">LinkedIn Profile</Label>
        <Input
          id="linkedIn"
          type="url"
          {...register("personalInfo.linkedIn")}
          placeholder="https://linkedin.com/in/yourprofile"
          className={errors.personalInfo?.linkedIn ? "border-destructive" : ""}
        />
        {errors.personalInfo?.linkedIn && (
          <p className="text-sm text-destructive">{errors.personalInfo.linkedIn.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="portfolio">Portfolio/Website</Label>
        <Input
          id="portfolio"
          type="url"
          {...register("personalInfo.portfolio")}
          placeholder="https://yourportfolio.com"
          className={errors.personalInfo?.portfolio ? "border-destructive" : ""}
        />
        {errors.personalInfo?.portfolio && (
          <p className="text-sm text-destructive">{errors.personalInfo.portfolio.message}</p>
        )}
      </div>
    </div>
  )
}

