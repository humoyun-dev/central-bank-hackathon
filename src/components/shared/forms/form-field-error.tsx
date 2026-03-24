"use client"

import { useOptionalTranslation } from "@/i18n/translate"

interface FormFieldErrorProps {
  message?: string | undefined
}

export function FormFieldError({ message }: FormFieldErrorProps) {
  const translate = useOptionalTranslation()

  if (!message) {
    return null
  }

  return (
    <p className="text-sm leading-5 text-destructive">
      {translate(message) ?? message}
    </p>
  )
}
