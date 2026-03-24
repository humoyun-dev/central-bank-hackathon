import { notFound } from "next/navigation"
import { getHouseholdContext } from "@/features/households/api/get-household-context"
import { getTransactions } from "@/features/transactions/api/get-transactions"
import {
  filterTransactions,
  parseTransactionFilters,
} from "@/features/transactions/schemas/transaction-filters"
import { TransactionsScreen } from "@/features/transactions/components/transactions-screen"

export default async function TransactionsPage({
  params,
  searchParams,
}: {
  params: Promise<{ householdId: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const [{ householdId }, resolvedSearchParams] = await Promise.all([params, searchParams])
  const [household, transactions] = await Promise.all([
    getHouseholdContext(householdId),
    getTransactions(householdId),
  ])

  if (!household) {
    notFound()
  }

  const filters = parseTransactionFilters(resolvedSearchParams)
  const filteredTransactions = filterTransactions(transactions, filters)

  return (
    <TransactionsScreen
      household={household}
      filters={filters}
      transactions={filteredTransactions}
    />
  )
}
