"use client"

import { Eye, HandCoins, Landmark, Plus } from "lucide-react"
import { useMemo, useState } from "react"
import { ActionMenu } from "@/components/shared/action-menu"
import { AmountValue } from "@/components/shared/amount-value"
import { EmptyState } from "@/components/shared/empty-state"
import { FormDialog } from "@/components/shared/forms/form-dialog"
import { PageHeader } from "@/components/shared/page-header"
import { SectionCard } from "@/components/shared/section-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Account } from "@/features/accounts/types/account"
import { DebtDetails } from "@/features/debts/components/debt-details"
import { DebtForm } from "@/features/debts/components/debt-form"
import { DebtSettlementForm } from "@/features/debts/components/debt-settlement-form"
import { DebtStatusBadge } from "@/features/debts/components/debt-status-badge"
import type { Debt, DebtStatus } from "@/features/debts/types/debt"
import { formatDateLabel } from "@/lib/format/date"
import { hasPermission } from "@/lib/permissions"
import type { HouseholdContext } from "@/types/household"

type DebtView = "ALL" | DebtStatus

export function DebtsWorkspace({
  household,
  debts,
  accounts,
  initialCreateOpen = false,
}: {
  household: HouseholdContext
  debts: Debt[]
  accounts: Account[]
  initialCreateOpen?: boolean
}) {
  const [view, setView] = useState<DebtView>("ALL")
  const openDebts = debts.filter((debt) => debt.status !== "SETTLED")
  const filteredDebts = useMemo(() => {
    if (view === "ALL") {
      return debts
    }

    return debts.filter((debt) => debt.status === view)
  }, [debts, view])
  const canCreateDebt = hasPermission(household.role, "createDebt")
  const canSettleDebt = hasPermission(household.role, "settleDebt")
  const activeAccounts = accounts.filter((account) => account.status === "ACTIVE")
  const [isCreateOpen, setIsCreateOpen] = useState(
    () => initialCreateOpen && canCreateDebt,
  )
  const [settlementDebtId, setSettlementDebtId] = useState<string | null>(null)
  const [detailDebtId, setDetailDebtId] = useState<string | null>(null)
  const detailDebt = debts.find((debt) => debt.id === detailDebtId) ?? null

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Debts"
        title={`${household.name} debt registry`}
        description="Receivables and payables stay explicit while create, detail, and settlement flows remain dialog-driven."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary">{openDebts.length} open items</Badge>
            {canCreateDebt ? (
              <Button type="button" onClick={() => setIsCreateOpen(true)}>
                <Plus className="size-4" aria-hidden="true" />
                Add debt
              </Button>
            ) : null}
            {canSettleDebt ? (
              <Button
                type="button"
                variant="outline"
                disabled={openDebts.length === 0 || activeAccounts.length === 0}
                title={
                  openDebts.length === 0
                    ? "Create a debt before recording settlement."
                    : activeAccounts.length === 0
                      ? "Create an active account first."
                      : undefined
                }
                onClick={() => setSettlementDebtId(openDebts[0]?.id ?? null)}
              >
                <HandCoins className="size-4" aria-hidden="true" />
                Settle debt
              </Button>
            ) : null}
          </div>
        }
      />

      <Tabs value={view} onValueChange={(nextValue) => setView(nextValue as DebtView)}>
        <TabsList>
          <TabsTrigger value="ALL">All</TabsTrigger>
          <TabsTrigger value="OPEN">Open</TabsTrigger>
          <TabsTrigger value="PARTIAL">Partial</TabsTrigger>
          <TabsTrigger value="SETTLED">Settled</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <SectionCard
          title="Debt ledger"
          description="Outstanding balances remain visible until settlement reaches zero."
        >
          {filteredDebts.length === 0 ? (
            <EmptyState
              title="No debts in this view"
              description="Create a receivable or payable to start tracking settlements."
              action={
                canCreateDebt ? (
                  <Button type="button" onClick={() => setIsCreateOpen(true)}>
                    Create debt
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <div className="space-y-3">
              {filteredDebts.map((debt) => (
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
                    <div className="flex items-start gap-2">
                      <ActionMenu
                        label={`${debt.counterpartyName} actions`}
                        items={[
                          {
                            label: "View details",
                            icon: <Eye className="size-4" aria-hidden="true" />,
                            onSelect: () => setDetailDebtId(debt.id),
                          },
                          ...(canSettleDebt && debt.status !== "SETTLED"
                            ? [
                                {
                                  label: "Settle debt",
                                  icon: <HandCoins className="size-4" aria-hidden="true" />,
                                  onSelect: () => setSettlementDebtId(debt.id),
                                },
                              ]
                            : []),
                        ]}
                      />
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
                  </div>
                </article>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Debt actions"
          description="Dialogs keep settlement and detail flows available without crowding the registry."
        >
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>Open, partial, and settled views are available through the tabs above.</p>
            <p>Settlement stays disabled until at least one active account is available.</p>
          </div>
          {canCreateDebt ? (
            <Button type="button" onClick={() => setIsCreateOpen(true)}>
              <Landmark className="size-4" aria-hidden="true" />
              Create debt
            </Button>
          ) : (
            <EmptyState
              title="Debt mutations are limited"
              description="This membership can review debt records but cannot create or settle them."
            />
          )}
        </SectionCard>
      </div>

      <FormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        title="Create debt"
        description="Track a household payable or receivable."
      >
        <DebtForm
          householdId={household.id}
          onCancel={() => setIsCreateOpen(false)}
          onSuccess={() => setIsCreateOpen(false)}
        />
      </FormDialog>

      <FormDialog
        open={Boolean(settlementDebtId)}
        onOpenChange={(open) => !open && setSettlementDebtId(null)}
        title="Settle debt"
        description="Record a partial or full settlement against a live account."
      >
        {settlementDebtId ? (
          <DebtSettlementForm
            householdId={household.id}
            debts={openDebts}
            accounts={activeAccounts}
            initialDebtId={settlementDebtId}
            onCancel={() => setSettlementDebtId(null)}
            onSuccess={() => setSettlementDebtId(null)}
          />
        ) : null}
      </FormDialog>

      <FormDialog
        open={Boolean(detailDebt)}
        onOpenChange={(open) => !open && setDetailDebtId(null)}
        title={detailDebt ? detailDebt.counterpartyName : "Debt details"}
        description="Review the remaining balance, status, and timing for this debt record."
      >
        {detailDebt ? <DebtDetails debt={detailDebt} /> : null}
      </FormDialog>
    </div>
  )
}
