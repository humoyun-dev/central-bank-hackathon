import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"

interface FormActionsProps {
  isSubmitting: boolean
  onCancel?: (() => void) | undefined
  submitLabel: string
  pendingLabel?: string
  secondaryAction?: ReactNode
  submitAdornment?: ReactNode
}

export function FormActions({
  isSubmitting,
  onCancel,
  submitLabel,
  pendingLabel = "Saving...",
  secondaryAction,
  submitAdornment,
}: FormActionsProps) {
  return (
    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>{secondaryAction}</div>
      <div className="flex flex-col-reverse gap-2 sm:flex-row">
        {onCancel ? (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        ) : null}
        <Button type="submit" disabled={isSubmitting}>
          {submitAdornment}
          {isSubmitting ? pendingLabel : submitLabel}
        </Button>
      </div>
    </div>
  )
}
