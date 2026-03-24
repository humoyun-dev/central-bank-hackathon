import { Landmark } from "lucide-react"
import { cn } from "@/lib/utils"

export function AppLogo({
  className,
  withWordmark = true,
}: {
  className?: string
  withWordmark?: boolean
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
        <Landmark className="size-5" aria-hidden="true" />
      </div>
      {withWordmark ? (
        <div className="space-y-0.5">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
            Central Bank
          </p>
          <p className="text-xs text-muted-foreground">
            Household finance workspace
          </p>
        </div>
      ) : null}
    </div>
  )
}
