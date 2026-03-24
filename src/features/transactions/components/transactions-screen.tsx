import Link from "next/link"
import { EmptyState } from "@/components/shared/empty-state"
import { PageHeader } from "@/components/shared/page-header"
import { SectionCard } from "@/components/shared/section-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type {
  TransactionFilters,
  TransactionListItem,
} from "@/features/transactions/types/transaction"
import type { HouseholdContext } from "@/types/household"
import { TransactionFiltersBar } from "@/features/transactions/components/transaction-filters"
import { TransactionRow } from "@/features/transactions/components/transaction-row"

export function TransactionsScreen({
  household,
  filters,
  transactions,
}: {
  household: HouseholdContext
  filters: TransactionFilters
  transactions: TransactionListItem[]
}) {
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
        description="Filters live in the URL so history, reloads, and deep links preserve the household-scoped transaction context."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary">{transactions.length} matches</Badge>
            <Button asChild variant="outline">
              <Link href={`/${household.id}/accounts`}>View accounts</Link>
            </Button>
          </div>
        }
      />
      <div className="grid gap-4 md:grid-cols-3">
        <SectionCard title="Inflow" description={`Filtered over ${filters.period}`}>
          <p className="text-financial text-2xl font-semibold text-success-foreground">
            +{(incomeMinor / 100).toFixed(2)} {household.currencyCode}
          </p>
        </SectionCard>
        <SectionCard title="Outflow" description={`Filtered over ${filters.period}`}>
          <p className="text-financial text-2xl font-semibold text-destructive">
            -{(expenseMinor / 100).toFixed(2)} {household.currencyCode}
          </p>
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
            description="Adjust the kind, period, or search term. This empty state is already ready for clear-filter or create-transaction actions in the next phase."
            action={
              <Button asChild variant="outline">
                <Link href={`/${household.id}/transactions`}>Clear filters</Link>
              </Button>
            }
          />
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <TransactionRow key={transaction.id} transaction={transaction} />
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  )
}
