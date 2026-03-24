"use client"

import { AlertTriangle } from "lucide-react"
import { useOptionalTranslation } from "@/i18n/translate"

interface InlineFormErrorProps {
  message?: string | undefined
}

export function InlineFormError({ message }: InlineFormErrorProps) {
  const translate = useOptionalTranslation()

  if (!message) {
    return null
  }

  return (
    <div className="flex items-start gap-2 rounded-[1rem] border border-destructive/20 bg-destructive/5 px-3 py-3 text-sm text-destructive">
      <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <p className="leading-6">{translate(message) ?? message}</p>
    </div>
  )
}
