"use client"

import { Coins, HandCoins, PiggyBank, PlusCircle, Repeat, WalletCards } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
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
  const locale = useLocale()
  const t = useTranslations("dashboard.actionCenter")
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
      label: t("actions.expense.label"),
      icon: WalletCards,
      visible: visibility.canCreateExpense,
      disabled: activeAccounts.length === 0 || expenseCategories.length === 0,
      description:
        activeAccounts.length === 0
          ? t("requirements.createActiveAccount")
          : expenseCategories.length === 0
            ? t("requirements.createExpenseCategory")
            : t("actions.expense.description"),
    },
    {
      id: "income" as const,
      label: t("actions.income.label"),
      icon: Coins,
      visible: visibility.canCreateIncome,
      disabled: activeAccounts.length === 0 || incomeCategories.length === 0,
      description:
        activeAccounts.length === 0
          ? t("requirements.createActiveAccount")
          : incomeCategories.length === 0
            ? t("requirements.createIncomeCategory")
            : t("actions.income.description"),
    },
    {
      id: "transfer" as const,
      label: t("actions.transfer.label"),
      icon: Repeat,
      visible: visibility.canInitiateTransfer,
      disabled: activeAccounts.length < 2,
      description:
        activeAccounts.length < 2
          ? t("requirements.twoActiveAccounts")
          : t("actions.transfer.description"),
    },
    {
      id: "debt" as const,
      label: t("actions.debt.label"),
      icon: HandCoins,
      visible: visibility.canCreateDebt,
      disabled: false,
      description: t("actions.debt.description"),
    },
    {
      id: "settlement" as const,
      label: t("actions.settlement.label"),
      icon: PlusCircle,
      visible: visibility.canSettleDebt,
      disabled: openDebts.length === 0 || activeAccounts.length === 0,
      description:
        openDebts.length === 0
          ? t("requirements.noOpenDebts")
          : activeAccounts.length === 0
            ? t("requirements.createActiveAccount")
            : t("actions.settlement.description"),
    },
    {
      id: "budget" as const,
      label: t("actions.budget.label"),
      icon: PiggyBank,
      visible: visibility.canManageBudgets,
      disabled: expenseCategories.length === 0,
      description:
        expenseCategories.length === 0
          ? t("requirements.createExpenseCategory")
          : t("actions.budget.description"),
    },
  ].filter((item) => item.visible)

  return (
    <section className="space-y-4">
      <SectionHeader
        title={t("title")}
        description={t("description")}
      />
      <div className="surface-card space-y-5 rounded-[1.75rem] bg-white/88 p-5">
        {actionItems.length === 0 ? (
          <div className="rounded-[1.2rem] border border-border/60 bg-muted/30 px-4 py-4 text-sm leading-6 text-muted-foreground">
            {t("readOnly")}
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
              {t("stats.activeAccounts")}
            </p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{activeAccounts.length}</p>
          </div>
          <div className="rounded-[1.2rem] bg-muted/35 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {t("stats.openDebts")}
              </p>
              <StatusBadge label={t("stats.openCount", { count: openDebts.length })} tone="warning" />
            </div>
            <div className="mt-3 space-y-3">
              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {t("stats.payables")}
                </p>
                <div className="mt-1">
                  <AmountValue
                    amountMinor={-openPayablesMinor}
                    currencyCode={household.currencyCode}
                    size="compact"
                    locale={locale}
                  />
                </div>
              </div>
              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {t("stats.receivables")}
                </p>
                <div className="mt-1">
                  <AmountValue
                    amountMinor={openReceivablesMinor}
                    currencyCode={household.currencyCode}
                    size="compact"
                    locale={locale}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-[1.2rem] bg-muted/35 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {t("stats.budgetRules")}
              </p>
              <StatusBadge label={t("stats.trackedCount", { count: budgets.length })} tone="primary" />
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {t("stats.budgetDescription")}
            </p>
          </div>
        </div>
      </div>

      <FormDialog
        open={activeDialog === "expense"}
        onOpenChange={(open) => !open && setActiveDialog(null)}
        title={t("dialogs.expense.title")}
        description={t("dialogs.expense.description")}
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
        title={t("dialogs.income.title")}
        description={t("dialogs.income.description")}
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
        title={t("dialogs.transfer.title")}
        description={t("dialogs.transfer.description")}
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
        title={t("dialogs.debt.title")}
        description={t("dialogs.debt.description")}
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
        title={t("dialogs.settlement.title")}
        description={t("dialogs.settlement.description")}
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
        title={t("dialogs.budget.title")}
        description={t("dialogs.budget.description")}
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
