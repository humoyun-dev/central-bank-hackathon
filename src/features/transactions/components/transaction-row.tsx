import type { ReactNode } from "react"
import { ArrowRightLeft, ArrowUpRight, MinusCircle } from "lucide-react"
import { StatusBadge } from "@/components/shared/status-badge"
import { formatDateLabel, formatRelativeDate } from "@/lib/format/date"
import { formatMoney } from "@/lib/format/money"
import { cn } from "@/lib/utils"
import type { TransactionListItem } from "@/features/transactions/types/transaction"
import { TransactionKindBadge } from "@/features/transactions/components/transaction-kind-badge"

const transactionMeta = {
  EXPENSE: {
    icon: MinusCircle,
    tone: "text-destructive",
  },
  INCOME: {
    icon: ArrowUpRight,
    tone: "text-success-foreground",
  },
  TRANSFER: {
    icon: ArrowRightLeft,
    tone: "text-primary",
  },
}

export function TransactionRow({
  transaction,
  compact = false,
  action,
}: {
  transaction: TransactionListItem
  compact?: boolean
  action?: ReactNode
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
            <TransactionKindBadge kind={transaction.kind} />
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
        <div className="flex items-start justify-end gap-2">
          <div>
            <p className={cn("text-financial text-sm font-semibold", meta.tone)}>
              {transaction.signedAmountMinor > 0
                ? "+"
                : transaction.signedAmountMinor < 0
                  ? "-"
                  : ""}
              {formatMoney(Math.abs(transaction.signedAmountMinor), transaction.currencyCode)}
            </p>
            {compact ? (
              <p className="text-xs text-muted-foreground">
                {formatRelativeDate(transaction.occurredAtUtc)}
              </p>
            ) : (
              <div className="mt-1 inline-flex justify-end">
                <StatusBadge
                  label={transaction.status}
                  tone={transaction.status === "POSTED" ? "success" : "warning"}
                />
              </div>
            )}
          </div>
          {action}
        </div>
      </div>
    </div>
  )
}
