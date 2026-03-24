export type TransactionKind = "EXPENSE" | "INCOME" | "TRANSFER"

export interface TransactionListItem {
  id: string
  kind: TransactionKind
  description: string
  categoryName: string
  accountName: string
  occurredAtUtc: string
  currencyCode: string
  amountMinor: number
  signedAmountMinor: number
  status: "POSTED" | "PENDING"
}

export type TransactionKindFilter = "ALL" | TransactionKind
export type TransactionPeriod = "7d" | "30d" | "90d"

export interface TransactionFilters {
  kind: TransactionKindFilter
  period: TransactionPeriod
  query: string
}
