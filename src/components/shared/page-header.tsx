import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  eyebrow?: string
  title: string
  description: string
  actions?: ReactNode
  className?: string
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-3 rounded-[1.75rem] border border-border/70 bg-card/90 p-5 shadow-[0_12px_36px_rgba(54,76,120,0.08)] sm:flex-row sm:items-start sm:justify-between",
        className,
      )}
    >
      <div className="space-y-1.5">
        {eyebrow ? (
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-primary/90">
            {eyebrow}
          </p>
        ) : null}
        <div className="space-y-1">
          <h1 className="text-[2rem] font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
      {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
    </header>
  )
}
