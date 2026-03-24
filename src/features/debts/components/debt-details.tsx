import { AmountValue } from "@/components/shared/amount-value"
import { DebtStatusBadge } from "@/features/debts/components/debt-status-badge"
import type { Debt } from "@/features/debts/types/debt"
import { formatDateLabel } from "@/lib/format/date"
import { Badge } from "@/components/ui/badge"

export function DebtDetails({ debt }: { debt: Debt }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-[1.2rem] border border-border/70 bg-card/75 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Remaining
          </p>
          <div className="mt-2">
            <AmountValue
              amountMinor={
                debt.direction === "PAYABLE"
                  ? -debt.remainingAmountMinor
                  : debt.remainingAmountMinor
              }
              currencyCode={debt.currencyCode}
              size="section"
            />
          </div>
        </div>
        <div className="rounded-[1.2rem] border border-border/70 bg-card/75 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Original
          </p>
          <div className="mt-2">
            <AmountValue
              amountMinor={
                debt.direction === "PAYABLE"
                  ? -debt.originalAmountMinor
                  : debt.originalAmountMinor
              }
              currencyCode={debt.currencyCode}
              size="section"
            />
          </div>
        </div>
      </div>
      <dl className="grid gap-3 rounded-[1.2rem] border border-border/70 bg-card/75 p-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Counterparty
          </dt>
          <dd className="mt-1 text-foreground">{debt.counterpartyName}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Direction
          </dt>
          <dd className="mt-1">
            <Badge variant={debt.direction === "PAYABLE" ? "warning" : "primary"}>
              {debt.direction}
            </Badge>
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Status
          </dt>
          <dd className="mt-1">
            <DebtStatusBadge status={debt.status} />
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Created
          </dt>
          <dd className="mt-1 text-foreground">{formatDateLabel(debt.createdAtUtc)}</dd>
        </div>
        {debt.dueAtUtc ? (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Due
            </dt>
            <dd className="mt-1 text-foreground">{formatDateLabel(debt.dueAtUtc)}</dd>
          </div>
        ) : null}
        {debt.description ? (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Description
            </dt>
            <dd className="mt-1 text-foreground">{debt.description}</dd>
          </div>
        ) : null}
      </dl>
    </div>
  )
}
