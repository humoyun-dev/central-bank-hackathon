import { AmountValue } from "@/components/shared/amount-value"
import { EmptyState } from "@/components/shared/empty-state"
import { PageHeader } from "@/components/shared/page-header"
import { SectionCard } from "@/components/shared/section-card"
import { Badge } from "@/components/ui/badge"
import { DebtForm } from "@/features/debts/components/debt-form"
import { DebtSettlementForm } from "@/features/debts/components/debt-settlement-form"
import { DebtStatusBadge } from "@/features/debts/components/debt-status-badge"
import { formatDateLabel } from "@/lib/format/date"
import type { Account } from "@/features/accounts/types/account"
import type { Debt } from "@/features/debts/types/debt"
import type { HouseholdContext } from "@/types/household"

export function DebtsScreen({
  household,
  debts,
  accounts,
}: {
  household: HouseholdContext
  debts: Debt[]
  accounts: Account[]
}) {
  const openDebts = debts.filter((debt) => debt.status !== "SETTLED")
  const settledDebts = debts.filter((debt) => debt.status === "SETTLED")

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Debts"
        title={`${household.name} debt registry`}
        description="Receivables and payables stay explicit, typed, and ready for future member-level settlement history."
        actions={<Badge variant="primary">{openDebts.length} open items</Badge>}
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="grid gap-4">
          <SectionCard
            title="Open and partial debts"
            description="Outstanding balances remain visible until settlement reaches zero."
          >
            {openDebts.length === 0 ? (
              <EmptyState
                title="No open debts"
                description="Create a receivable or payable to start tracking settlements."
              />
            ) : (
              <div className="space-y-3">
                {openDebts.map((debt) => (
                  <article
                    key={debt.id}
                    className="rounded-[1.2rem] border border-border/70 bg-card/75 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-base font-semibold text-foreground">
                            {debt.counterpartyName}
                          </h2>
                          <DebtStatusBadge status={debt.status} />
                          <Badge variant={debt.direction === "PAYABLE" ? "warning" : "primary"}>
                            {debt.direction}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Created {formatDateLabel(debt.createdAtUtc)}
                          {debt.dueAtUtc ? ` · Due ${formatDateLabel(debt.dueAtUtc)}` : ""}
                        </p>
                        {debt.description ? (
                          <p className="text-sm leading-6 text-muted-foreground">
                            {debt.description}
                          </p>
                        ) : null}
                      </div>
                      <AmountValue
                        amountMinor={
                          debt.direction === "PAYABLE"
                            ? -debt.remainingAmountMinor
                            : debt.remainingAmountMinor
                        }
                        currencyCode={debt.currencyCode}
                        size="compact"
                      />
                    </div>
                  </article>
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard
            title="Settled history"
            description="Closed items remain visible for reconciliation and future audit flows."
          >
            {settledDebts.length === 0 ? (
              <EmptyState
                title="No settled debts yet"
                description="Completed settlements will appear here."
              />
            ) : (
              <div className="space-y-3">
                {settledDebts.map((debt) => (
                  <article
                    key={debt.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-[1.2rem] border border-border/70 bg-card/75 p-4"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">
                        {debt.counterpartyName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Settled · {formatDateLabel(debt.createdAtUtc)}
                      </p>
                    </div>
                    <DebtStatusBadge status={debt.status} />
                  </article>
                ))}
              </div>
            )}
          </SectionCard>
        </div>

        <div className="grid gap-4">
          <SectionCard
            title="Create debt"
            description="Add a payable or receivable without leaving the debt workspace."
          >
            <DebtForm householdId={household.id} />
          </SectionCard>
          <SectionCard
            title="Settle debt"
            description="Record partial or full settlement against a live account."
          >
            {openDebts.length === 0 ? (
              <EmptyState
                title="No debt is ready for settlement"
                description="Create a debt first, then record repayment from this panel."
              />
            ) : (
              <DebtSettlementForm
                householdId={household.id}
                debts={openDebts}
                accounts={accounts.filter((account) => account.status === "ACTIVE")}
              />
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  )
}
