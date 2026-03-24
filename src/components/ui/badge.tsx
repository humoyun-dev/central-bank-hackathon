import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em]",
  {
    variants: {
      variant: {
        neutral: "border-border bg-muted/70 text-muted-foreground",
        primary: "border-primary/15 bg-primary/10 text-primary",
        success: "border-success/20 bg-success/15 text-success-foreground",
        warning: "border-warning/20 bg-warning/20 text-warning-foreground",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
)

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
