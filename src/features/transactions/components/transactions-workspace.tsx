"use client"

import { ArrowRightLeft, Eye, PlusCircle, WalletCards } from "lucide-react"
import Link from "next/link"
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
        eyebrow="Transactions"
        title="Shareable activity workspace"
        description="Filters live in the URL while create and detail flows stay inside focused dialogs."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary">{transactions.length} matches</Badge>
            {canCreateExpense ? (
              <Button
                type="button"
                disabled={expenseActionDisabled}
                title={
                  activeAccounts.length === 0
                    ? "Create an active account first."
                    : expenseCategories.length === 0
                      ? "Create an expense category first."
                      : undefined
                }
                onClick={() => setActiveDialog("expense")}
              >
                <WalletCards className="size-4" aria-hidden="true" />
                Add expense
              </Button>
            ) : null}
            {canCreateIncome ? (
              <Button
                type="button"
                variant="outline"
                disabled={incomeActionDisabled}
                title={
                  activeAccounts.length === 0
                    ? "Create an active account first."
                    : incomeCategories.length === 0
                      ? "Create an income category first."
                      : undefined
                }
                onClick={() => setActiveDialog("income")}
              >
                <PlusCircle className="size-4" aria-hidden="true" />
                Add income
              </Button>
            ) : null}
            {canTransfer ? (
              <Button
                type="button"
                variant="outline"
                disabled={transferActionDisabled}
                title={
                  transferActionDisabled
                    ? "Transfers require at least two active accounts."
                    : undefined
                }
                onClick={() => setActiveDialog("transfer")}
              >
                <ArrowRightLeft className="size-4" aria-hidden="true" />
                Transfer
              </Button>
            ) : null}
            <Button asChild variant="outline">
              <Link href={`/${household.id}/accounts`}>View accounts</Link>
            </Button>
          </div>
        }
      />
      <div className="grid gap-4 md:grid-cols-3">
        <SectionCard title="Inflow" description={`Filtered over ${filters.period}`}>
          <AmountValue
            amountMinor={incomeMinor}
            currencyCode={household.currencyCode}
            size="section"
            className="text-success-foreground"
          />
        </SectionCard>
        <SectionCard title="Outflow" description={`Filtered over ${filters.period}`}>
          <AmountValue
            amountMinor={-expenseMinor}
            currencyCode={household.currencyCode}
            size="section"
          />
        </SectionCard>
        <SectionCard title="Active filter" description="Current scope">
          <div className="flex flex-wrap gap-2">
            <Badge>{filters.kind}</Badge>
            <Badge>{filters.period}</Badge>
            {filters.query ? <Badge variant="primary">{filters.query}</Badge> : null}
          </div>
        </SectionCard>
      </div>
      <TransactionFiltersBar initialFilters={filters} />
      <SectionCard
        title="Transaction feed"
        description="Mapped DTOs, normalized timestamps, and explicit money semantics keep the list safe for later mutations and analytics overlays."
      >
        {transactions.length === 0 ? (
          <EmptyState
            title="No transactions match this filter set"
            description="Adjust the kind, period, or search term. Create flows remain available from the header."
            action={
              <Button asChild variant="outline">
                <Link href={`/${household.id}/transactions`}>Clear filters</Link>
              </Button>
            }
          />
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <TransactionRow
                key={transaction.id}
                transaction={transaction}
                action={
                  <ActionMenu
                    label={`${transaction.description} actions`}
                    items={[
                      {
                        label: "View details",
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
        title="Record expense"
        description="Book a household outflow from the activity workspace."
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
        description="Capture a new inflow without leaving the transaction workspace."
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
        description="Move household cash between active account surfaces."
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
        title={selectedTransaction ? selectedTransaction.description : "Transaction details"}
        description="Review normalized transaction metadata from the typed household ledger."
      >
        {selectedTransaction ? <TransactionDetails transaction={selectedTransaction} /> : null}
      </FormDialog>
    </div>
  )
}
