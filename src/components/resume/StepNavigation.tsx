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
    <div className="flex justify-between pt-4 border-t animate-fade-in">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={currentStep === 1}
        className="group"
      >
        <span className="group-hover:-translate-x-1 transition-transform duration-200 inline-block">
          ←
        </span>
        <span className="ml-1">Previous</span>
      </Button>

      {currentStep < totalSteps ? (
        <Button 
          type="button" 
          onClick={onNext} 
          disabled={isNextDisabled}
          className="group"
        >
          <span>Next</span>
          <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">
            →
          </span>
        </Button>
      ) : (
        <Button 
          type="submit" 
          onClick={onSubmit}
          className="group bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
        >
          <span>Submit Resume</span>
          <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">
            ✓
          </span>
        </Button>
      )}
    </div>
  )
}

