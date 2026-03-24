import { ArrowRightLeft, ArrowUpRight, MinusCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatDateLabel, formatRelativeDate } from "@/lib/format/date"
import { formatMoney } from "@/lib/format/money"
import { cn } from "@/lib/utils"
import type { TransactionListItem } from "@/features/transactions/types/transaction"

const transactionMeta = {
  EXPENSE: {
    icon: MinusCircle,
    tone: "text-destructive",
    badge: "warning" as const,
  },
  INCOME: {
    icon: ArrowUpRight,
    tone: "text-success-foreground",
    badge: "success" as const,
  },
  TRANSFER: {
    icon: ArrowRightLeft,
    tone: "text-primary",
    badge: "primary" as const,
  },
}

export function TransactionRow({
  transaction,
  compact = false,
}: {
  transaction: TransactionListItem
  compact?: boolean
}) {
  const meta = transactionMeta[transaction.kind]
  const Icon = meta.icon

  return (
    <div className="flex items-start justify-between gap-4 rounded-[var(--radius-md)] border border-border/60 bg-background/70 p-4">
      <div className="flex min-w-0 items-start gap-3">
        <div
          className={cn(
            "mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-2xl bg-muted",
            meta.tone,
          )}
        >
          <Icon className="size-4" aria-hidden="true" />
        </div>
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-sm font-semibold text-foreground">
              {transaction.description}
            </p>
            <Badge variant={meta.badge}>{transaction.kind}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {transaction.categoryName} via {transaction.accountName}
          </p>
          {!compact ? (
            <p className="text-xs text-muted-foreground">
              {formatDateLabel(transaction.occurredAtUtc)} ·{" "}
              {formatRelativeDate(transaction.occurredAtUtc)}
            </p>
          ) : null}
        </div>
      </div>
      <div className="shrink-0 text-right">
        <p className={cn("text-financial text-sm font-semibold", meta.tone)}>
          {transaction.kind === "EXPENSE" ? "-" : transaction.kind === "INCOME" ? "+" : ""}
          {formatMoney(transaction.amountMinor, transaction.currencyCode)}
        </p>
        {compact ? (
          <p className="text-xs text-muted-foreground">
            {formatRelativeDate(transaction.occurredAtUtc)}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">{transaction.status}</p>
        )}
      </div>
    </div>
  )
}
