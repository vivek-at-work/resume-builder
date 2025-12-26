import { Button } from "@/components/ui/button"

interface StepNavigationProps {
  currentStep: number
  totalSteps: number
  onPrevious: () => void
  onNext?: () => void
  onSubmit?: () => void
  isNextDisabled?: boolean
}

export function StepNavigation({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSubmit,
  isNextDisabled = false,
}: StepNavigationProps) {
  return (
    <div className="flex justify-between pt-4 border-t">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={currentStep === 1}
      >
        Previous
      </Button>

      {currentStep < totalSteps ? (
        <Button type="button" onClick={onNext} disabled={isNextDisabled}>
          Next
        </Button>
      ) : (
        <Button type="submit" onClick={onSubmit}>
          Submit Resume
        </Button>
      )}
    </div>
  )
}

