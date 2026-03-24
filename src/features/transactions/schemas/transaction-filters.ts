import { isAfter, parseISO, subDays } from "date-fns"
import { z } from "zod"
import { isNonEmptyString } from "@/lib/utils"
import type {
  TransactionFilters,
  TransactionListItem,
  TransactionPeriod,
} from "@/features/transactions/types/transaction"

const transactionFiltersSchema = z.object({
  kind: z.enum(["ALL", "EXPENSE", "INCOME", "TRANSFER"]).catch("ALL"),
  period: z.enum(["7d", "30d", "90d"]).catch("30d"),
  query: z.string().trim().max(60).catch(""),
})

function getFirstSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

function getLookbackDays(period: TransactionPeriod) {
  switch (period) {
    case "7d":
      return 7
    case "30d":
      return 30
    case "90d":
      return 90
  }
}

export function parseTransactionFilters(
  searchParams: Record<string, string | string[] | undefined>,
): TransactionFilters {
  return transactionFiltersSchema.parse({
    kind: getFirstSearchParam(searchParams.kind),
    period: getFirstSearchParam(searchParams.period),
    query: getFirstSearchParam(searchParams.query),
  })
}

export function filterTransactions(
  transactions: TransactionListItem[],
  filters: TransactionFilters,
) {
  const lookbackStart = subDays(new Date(), getLookbackDays(filters.period))
  const query = filters.query.toLowerCase()

  return transactions.filter((transaction) => {
    const matchesKind =
      filters.kind === "ALL" ? true : transaction.kind === filters.kind
    const matchesPeriod = isAfter(parseISO(transaction.occurredAtUtc), lookbackStart)
    const matchesQuery = isNonEmptyString(query)
      ? [transaction.description, transaction.categoryName, transaction.accountName]
          .join(" ")
          .toLowerCase()
          .includes(query)
      : true

    return matchesKind && matchesPeriod && matchesQuery
  })
}
