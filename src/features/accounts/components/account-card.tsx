import { Building2, CreditCard, WalletCards } from "lucide-react"
import { AmountValue } from "@/components/shared/amount-value"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { Account } from "@/features/accounts/types/account"
import { cn } from "@/lib/utils"

const accountMeta = {
  BANK: {
    label: "Bank",
    icon: Building2,
  },
  CARD: {
    label: "Card",
    icon: CreditCard,
  },
  CASH: {
    label: "Cash",
    icon: WalletCards,
  },
} as const

export function AccountCard({
  account,
  compact = false,
}: {
  account: Account
  compact?: boolean
}) {
  const meta = accountMeta[account.kind]
  const Icon = meta.icon

  return (
    <Card className={cn("bg-card/94", compact ? "rounded-[1.5rem]" : "rounded-[1.75rem]")}>
      <CardContent className={cn("space-y-4", compact ? "px-5 pb-5 pt-5" : "px-5 pb-5 pt-5")}>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold">{account.name}</h3>
              <Badge>{meta.label}</Badge>
              {account.isPrimary ? <Badge variant="primary">Primary</Badge> : null}
            </div>
            <p className="text-sm text-muted-foreground">
              {account.institutionName}
              {account.maskedNumber ? ` •••• ${account.maskedNumber}` : ""}
            </p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-[1.1rem] bg-primary/10 text-primary">
            <Icon className="size-5" aria-hidden="true" />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Available
          </p>
          <AmountValue
            amountMinor={account.availableBalanceMinor}
            currencyCode={account.currencyCode}
            size={compact ? "compact" : "section"}
          />
        </div>
        {!compact ? (
          <div className="surface-muted flex items-center justify-between rounded-[1rem] px-4 py-3 text-sm">
            <span className="text-muted-foreground">Ledger balance</span>
            <span className="text-financial font-medium text-foreground">
              {(account.balanceMinor / 100).toFixed(2)} {account.currencyCode}
            </span>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
