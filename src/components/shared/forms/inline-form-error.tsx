import { AlertTriangle } from "lucide-react"

interface InlineFormErrorProps {
  message?: string | undefined
}

export function InlineFormError({ message }: InlineFormErrorProps) {
  if (!message) {
    return null
  }

  return (
    <div className="flex items-start gap-2 rounded-[1rem] border border-destructive/20 bg-destructive/5 px-3 py-3 text-sm text-destructive">
      <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <p className="leading-6">{message}</p>
    </div>
  )
}
