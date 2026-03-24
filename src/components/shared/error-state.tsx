import type { ReactNode } from "react"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorStateProps {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  action?: ReactNode
}

export function ErrorState({
  title,
  description,
  actionLabel,
  onAction,
  action,
}: ErrorStateProps) {
  return (
    <div className="surface-muted flex flex-col items-start gap-4 p-6">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <AlertTriangle className="size-5" aria-hidden="true" />
      </div>
      <div className="space-y-1.5">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="max-w-lg text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
      {action ? action : null}
      {!action && actionLabel && onAction ? (
        <Button onClick={onAction} variant="outline">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  )
}
