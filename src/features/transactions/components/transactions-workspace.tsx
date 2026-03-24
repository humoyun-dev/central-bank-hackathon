"use client"

import { ArrowRightLeft, Eye, PlusCircle, WalletCards } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useMemo, useState } from "react"
import { ActionMenu } from "@/components/shared/action-menu"
import { EmptyState } from "@/components/shared/empty-state"
import { FormDialog } from "@/components/shared/forms/form-dialog"
import { PageHeader } from "@/components/shared/page-header"
import { SectionCard } from "@/components/shared/section-card"
import { AmountValue } from "@/components/shared/amount-value"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Account } from "@/features/accounts/types/account"
import type { Category } from "@/features/categories/types/category"
import { ExpenseForm } from "@/features/transactions/components/expense-form"
import { IncomeForm } from "@/features/transactions/components/income-form"
import { TransactionDetails } from "@/features/transactions/components/transaction-details"
import { TransactionFiltersBar } from "@/features/transactions/components/transaction-filters"
import { TransactionRow } from "@/features/transactions/components/transaction-row"
import { TransferForm } from "@/features/transactions/components/transfer-form"
import { Link } from "@/i18n/navigation"
import type {
  TransactionFilters,
  TransactionListItem,
} from "@/features/transactions/types/transaction"
import { hasPermission } from "@/lib/permissions"
import type { HouseholdContext } from "@/types/household"

type TransactionDialog = "expense" | "income" | "transfer" | null

export function TransactionsWorkspace({
  household,
  filters,
  transactions,
  accounts,
  expenseCategories,
  incomeCategories,
  initialAction,
}: {
  household: HouseholdContext
  filters: TransactionFilters
  transactions: TransactionListItem[]
  accounts: Account[]
  expenseCategories: Category[]
  incomeCategories: Category[]
  initialAction?: "expense" | "income" | "transfer" | undefined
}) {
  const locale = useLocale()
  const t = useTranslations("transactions.workspace")
  const activeAccounts = useMemo(
    () => accounts.filter((account) => account.status === "ACTIVE"),
    [accounts],
  )
  const canCreateExpense = hasPermission(household.role, "createExpense")
  const canCreateIncome = hasPermission(household.role, "createIncome")
  const canTransfer = hasPermission(household.role, "initiateTransfer")
  const expenseActionDisabled = activeAccounts.length === 0 || expenseCategories.length === 0
  const incomeActionDisabled = activeAccounts.length === 0 || incomeCategories.length === 0
  const transferActionDisabled = activeAccounts.length < 2
  const [activeDialog, setActiveDialog] = useState<TransactionDialog>(() => {
    if (
      (initialAction === "expense" && canCreateExpense && !expenseActionDisabled) ||
      (initialAction === "income" && canCreateIncome && !incomeActionDisabled) ||
      (initialAction === "transfer" && canTransfer && !transferActionDisabled)
    ) {
      return initialAction
    }

    return null
  })
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null)
  const selectedTransaction =
    transactions.find((transaction) => transaction.id === selectedTransactionId) ?? null

  const incomeMinor = transactions
    .filter((transaction) => transaction.kind === "INCOME")
    .reduce((sum, transaction) => sum + transaction.amountMinor, 0)
  const expenseMinor = transactions
    .filter((transaction) => transaction.kind === "EXPENSE")
    .reduce((sum, transaction) => sum + transaction.amountMinor, 0)

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary">{t("matches", { count: transactions.length })}</Badge>
            {canCreateExpense ? (
              <Button
                type="button"
                disabled={expenseActionDisabled}
                title={
                  activeAccounts.length === 0
                    ? t("requirements.activeAccount")
                    : expenseCategories.length === 0
                      ? t("requirements.expenseCategory")
                      : undefined
                }
                onClick={() => setActiveDialog("expense")}
              >
                <WalletCards className="size-4" aria-hidden="true" />
                {t("actions.addExpense")}
              </Button>
            ) : null}
            {canCreateIncome ? (
              <Button
                type="button"
                variant="outline"
                disabled={incomeActionDisabled}
                title={
                  activeAccounts.length === 0
                    ? t("requirements.activeAccount")
                    : incomeCategories.length === 0
                      ? t("requirements.incomeCategory")
                      : undefined
                }
                onClick={() => setActiveDialog("income")}
              >
                <PlusCircle className="size-4" aria-hidden="true" />
                {t("actions.addIncome")}
              </Button>
            ) : null}
            {canTransfer ? (
              <Button
                type="button"
                variant="outline"
                disabled={transferActionDisabled}
                title={
                  transferActionDisabled
                    ? t("requirements.transferAccounts")
                    : undefined
                }
                onClick={() => setActiveDialog("transfer")}
              >
                <ArrowRightLeft className="size-4" aria-hidden="true" />
                {t("actions.transfer")}
              </Button>
            ) : null}
            <Button asChild variant="outline">
              <Link href={`/${household.id}/accounts`}>{t("actions.viewAccounts")}</Link>
            </Button>
          </div>
        }
      />
      <div className="grid gap-4 md:grid-cols-3">
        <SectionCard title={t("summary.inflow")} description={t(`summary.periods.${filters.period}`)}>
          <AmountValue
            amountMinor={incomeMinor}
            currencyCode={household.currencyCode}
            size="section"
            locale={locale}
            className="text-success-foreground"
          />
        </SectionCard>
        <SectionCard title={t("summary.outflow")} description={t(`summary.periods.${filters.period}`)}>
          <AmountValue
            amountMinor={-expenseMinor}
            currencyCode={household.currencyCode}
            size="section"
            locale={locale}
          />
        </SectionCard>
        <SectionCard title={t("summary.activeFilter")} description={t("summary.currentScope")}>
          <div className="flex flex-wrap gap-2">
            <Badge>{t(`filters.kinds.${filters.kind.toLowerCase()}`)}</Badge>
            <Badge>{t(`summary.periods.${filters.period}`)}</Badge>
            {filters.query ? <Badge variant="primary">{filters.query}</Badge> : null}
          </div>
        </SectionCard>
      </div>
      <TransactionFiltersBar initialFilters={filters} />
      <SectionCard
        title={t("feed.title")}
        description={t("feed.description")}
      >
        {transactions.length === 0 ? (
          <EmptyState
            title={t("feed.emptyTitle")}
            description={t("feed.emptyDescription")}
            action={
              <Button asChild variant="outline">
                <Link href={`/${household.id}/transactions`}>{t("feed.clearFilters")}</Link>
              </Button>
            }
          />
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <TransactionRow
                key={transaction.id}
                transaction={transaction}
                locale={locale}
                action={
                  <ActionMenu
                    label={t("transactionActions", { transaction: transaction.description })}
                    items={[
                      {
                        label: t("viewDetails"),
                        icon: <Eye className="size-4" aria-hidden="true" />,
                        onSelect: () => setSelectedTransactionId(transaction.id),
                      },
                    ]}
                  />
                }
              />
            ))}
          </div>
        )}
      </SectionCard>

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
        open={Boolean(selectedTransaction)}
        onOpenChange={(open) => !open && setSelectedTransactionId(null)}
        title={selectedTransaction ? selectedTransaction.description : t("dialogs.detailsFallbackTitle")}
        description={t("dialogs.detailsDescription")}
      >
        {selectedTransaction ? (
          <TransactionDetails transaction={selectedTransaction} locale={locale} />
        ) : null}
      </FormDialog>
    </div>
  )
}
