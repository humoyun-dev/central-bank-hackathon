import type { LucideIcon } from "lucide-react"
import { Inbox } from "lucide-react"
import type { ReactNode } from "react"

interface EmptyStateProps {
  title: string
  description: string
  action?: ReactNode
  icon?: LucideIcon
}

export function EmptyState({
  title,
  description,
  action,
  icon: Icon = Inbox,
}: EmptyStateProps) {
  return (
    <div className="surface-muted flex flex-col items-start gap-4 p-6">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-background text-primary shadow-sm">
        <Icon className="size-5" aria-hidden="true" />
      </div>
      <div className="space-y-1.5">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="max-w-lg text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
      {action}
    </div>
  )
}
