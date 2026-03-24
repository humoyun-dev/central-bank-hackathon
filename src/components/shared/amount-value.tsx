import { cn } from "@/lib/utils"
import { formatMoney } from "@/lib/format/money"

type AmountValueSize = "hero" | "section" | "compact"

interface AmountValueProps {
  amountMinor: number
  currencyCode: string
  size?: AmountValueSize
  compact?: boolean
  className?: string
}

const sizeClassNames: Record<AmountValueSize, string> = {
  hero: "text-4xl sm:text-5xl",
  section: "text-2xl sm:text-3xl",
  compact: "text-base sm:text-lg",
}

export function AmountValue({
  amountMinor,
  currencyCode,
  size = "section",
  compact = false,
  className,
}: AmountValueProps) {
  const toneClassName =
    amountMinor < 0 ? "text-destructive" : "text-foreground"

  return (
    <p
      className={cn(
        "text-financial font-semibold leading-none",
        sizeClassNames[size],
        toneClassName,
        className,
      )}
    >
      {formatMoney(amountMinor, currencyCode, { compact })}
    </p>
  )
}
