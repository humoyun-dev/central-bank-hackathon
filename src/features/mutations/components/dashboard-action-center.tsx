"use client"

import { Coins, HandCoins, PiggyBank, PlusCircle, Repeat, WalletCards } from "lucide-react"
import { useState } from "react"
import { AmountValue } from "@/components/shared/amount-value"
import { FormDialog } from "@/components/shared/forms/form-dialog"
import { SectionHeader } from "@/components/shared/section-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import type { Account } from "@/features/accounts/types/account"
import { BudgetForm } from "@/features/budgets/components/budget-form"
import type { Budget } from "@/features/budgets/types/budget"
import type { Category } from "@/features/categories/types/category"
import { DebtForm } from "@/features/debts/components/debt-form"
import { DebtSettlementForm } from "@/features/debts/components/debt-settlement-form"
import type { Debt } from "@/features/debts/types/debt"
import { IncomeForm } from "@/features/transactions/components/income-form"
import { TransferForm } from "@/features/transactions/components/transfer-form"
import { ExpenseForm } from "@/features/transactions/components/expense-form"
import { getVisibleDashboardActions } from "@/lib/permissions"
import type { HouseholdContext } from "@/types/household"

type ActionDialog =
  | "expense"
  | "income"
  | "transfer"
  | "debt"
  | "settlement"
  | "budget"
  | null

export function DashboardActionCenter({
  household,
  accounts,
  expenseCategories,
  incomeCategories,
  debts,
  budgets,
}: {
  household: HouseholdContext
  accounts: Account[]
  expenseCategories: Category[]
  incomeCategories: Category[]
  debts: Debt[]
  budgets: Budget[]
}) {
  const [activeDialog, setActiveDialog] = useState<ActionDialog>(null)
  const visibility = getVisibleDashboardActions(household.role)
  const activeAccounts = accounts.filter((account) => account.status === "ACTIVE")
  const openDebts = debts.filter((debt) => debt.status !== "SETTLED")
  const openPayablesMinor = openDebts
    .filter((debt) => debt.direction === "PAYABLE")
    .reduce((sum, debt) => sum + debt.remainingAmountMinor, 0)
  const openReceivablesMinor = openDebts
    .filter((debt) => debt.direction === "RECEIVABLE")
    .reduce((sum, debt) => sum + debt.remainingAmountMinor, 0)

  const actionItems = [
    {
      id: "expense" as const,
      label: "Add expense",
      icon: WalletCards,
      visible: visibility.canCreateExpense,
      disabled: activeAccounts.length === 0 || expenseCategories.length === 0,
      description: "Book a household outflow",
    },
    {
      id: "income" as const,
      label: "Add income",
      icon: Coins,
      visible: visibility.canCreateIncome,
      disabled: activeAccounts.length === 0 || incomeCategories.length === 0,
      description: "Record a new inflow",
    },
    {
      id: "transfer" as const,
      label: "Transfer",
      icon: Repeat,
      visible: visibility.canInitiateTransfer,
      disabled: activeAccounts.length < 2,
      description: "Move cash between accounts",
    },
    {
      id: "debt" as const,
      label: "Add debt",
      icon: HandCoins,
      visible: visibility.canCreateDebt,
      disabled: false,
      description: "Track a payable or receivable",
    },
    {
      id: "settlement" as const,
      label: "Settle debt",
      icon: PlusCircle,
      visible: visibility.canSettleDebt,
      disabled: openDebts.length === 0 || activeAccounts.length === 0,
      description: "Record a partial or full settlement",
    },
    {
      id: "budget" as const,
      label: "Budget limit",
      icon: PiggyBank,
      visible: visibility.canManageBudgets,
      disabled: expenseCategories.length === 0,
      description: "Create or update a category cap",
    },
  ].filter((item) => item.visible)

  return (
    <section className="space-y-4">
      <SectionHeader
        title="Quick actions"
        description="Open product-grade finance forms directly from the overview. Mutations use same-origin BFF handlers, idempotency keys, and route refresh after success."
      />
      <div className="surface-card space-y-5 rounded-[1.75rem] bg-white/88 p-5">
        {actionItems.length === 0 ? (
          <div className="rounded-[1.2rem] border border-border/60 bg-muted/30 px-4 py-4 text-sm leading-6 text-muted-foreground">
            This membership can review balances and activity, but mutation flows are hidden because the role is read-only.
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {actionItems.map(({ id, label, icon: Icon, disabled, description }) => (
              <Button
                key={id}
                type="button"
                variant={id === "expense" ? "default" : "outline"}
                disabled={disabled}
                className="h-auto justify-start rounded-[1.2rem] px-4 py-4 text-left"
                onClick={() => setActiveDialog(id)}
              >
                <span className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-background text-foreground shadow-sm">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <span className="space-y-1">
                    <span className="block text-sm font-semibold">{label}</span>
                    <span className="block text-xs text-muted-foreground">{description}</span>
                  </span>
                </span>
              </Button>
            ))}
          </div>
        )}
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-[1.2rem] bg-muted/35 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Active accounts
            </p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{activeAccounts.length}</p>
          </div>
          <div className="rounded-[1.2rem] bg-muted/35 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Open debts
              </p>
              <StatusBadge label={`${openDebts.length} open`} tone="warning" />
            </div>
            <div className="mt-3 space-y-3">
              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Payables
                </p>
                <div className="mt-1">
                  <AmountValue
                    amountMinor={-openPayablesMinor}
                    currencyCode={household.currencyCode}
                    size="compact"
                  />
                </div>
              </div>
              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Receivables
                </p>
                <div className="mt-1">
                  <AmountValue
                    amountMinor={openReceivablesMinor}
                    currencyCode={household.currencyCode}
                    size="compact"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-[1.2rem] bg-muted/35 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Budget rules
              </p>
              <StatusBadge label={`${budgets.length} tracked`} tone="primary" />
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Category caps stay aligned with household-scoped expenses after each refresh.
            </p>
          </div>
        </div>
      </div>

      <FormDialog
        open={activeDialog === "expense"}
        onOpenChange={(open) => !open && setActiveDialog(null)}
        title="Record expense"
        description="Post a new household expense against an active account and category."
      >
        <ExpenseForm
          householdId={household.id}
          accounts={activeAccounts}
          categories={expenseCategories}
          onCancel={() => setActiveDialog(null)}
          onSuccess={() => setActiveDialog(null)}
        />
      </FormDialog>

      <FormDialog
        open={activeDialog === "income"}
        onOpenChange={(open) => !open && setActiveDialog(null)}
        title="Record income"
        description="Post a new household inflow into an active account."
      >
        <IncomeForm
          householdId={household.id}
          accounts={activeAccounts}
          categories={incomeCategories}
          onCancel={() => setActiveDialog(null)}
          onSuccess={() => setActiveDialog(null)}
        />
      </FormDialog>

      <FormDialog
        open={activeDialog === "transfer"}
        onOpenChange={(open) => !open && setActiveDialog(null)}
        title="Create transfer"
        description="Move available balance between two household accounts."
      >
        <TransferForm
          householdId={household.id}
          accounts={activeAccounts}
          onCancel={() => setActiveDialog(null)}
          onSuccess={() => setActiveDialog(null)}
        />
      </FormDialog>

      <FormDialog
        open={activeDialog === "debt"}
        onOpenChange={(open) => !open && setActiveDialog(null)}
        title="Create debt"
        description="Track a payable or receivable without leaving the dashboard overview."
      >
        <DebtForm
          householdId={household.id}
          onCancel={() => setActiveDialog(null)}
          onSuccess={() => setActiveDialog(null)}
        />
      </FormDialog>

      <FormDialog
        open={activeDialog === "settlement"}
        onOpenChange={(open) => !open && setActiveDialog(null)}
        title="Settle debt"
        description="Record a partial or full debt settlement from a live account surface."
      >
        <DebtSettlementForm
          householdId={household.id}
          debts={openDebts}
          accounts={activeAccounts}
          onCancel={() => setActiveDialog(null)}
          onSuccess={() => setActiveDialog(null)}
        />
      </FormDialog>

      <FormDialog
        open={activeDialog === "budget"}
        onOpenChange={(open) => !open && setActiveDialog(null)}
        title="Set budget limit"
        description="Create or update an expense budget rule for the active household."
      >
        <BudgetForm
          householdId={household.id}
          categories={expenseCategories}
          budgets={budgets}
          onCancel={() => setActiveDialog(null)}
          onSuccess={() => setActiveDialog(null)}
        />
      </FormDialog>
    </section>
  )
}
