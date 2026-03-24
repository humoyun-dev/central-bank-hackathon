"use client"

import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"
import { useOptionalTranslation } from "@/i18n/translate"

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
  pendingLabel,
  secondaryAction,
  submitAdornment,
}: FormActionsProps) {
  const t = useTranslations("common.actions")
  const translate = useOptionalTranslation()
  const resolvedSubmitLabel = translate(submitLabel) ?? submitLabel
  const resolvedPendingLabel =
    translate(pendingLabel) ?? pendingLabel ?? t("saving")

  return (
    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>{secondaryAction}</div>
      <div className="flex flex-col-reverse gap-2 sm:flex-row">
        {onCancel ? (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            {t("cancel")}
          </Button>
        ) : null}
        <Button type="submit" disabled={isSubmitting}>
          {submitAdornment}
          {isSubmitting ? resolvedPendingLabel : resolvedSubmitLabel}
        </Button>
      </div>
    </div>
  )
}
