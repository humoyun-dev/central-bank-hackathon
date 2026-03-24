export type AccountKind = "BANK" | "CARD" | "CASH"
export type AccountStatus = "ACTIVE" | "RESTRICTED" | "ARCHIVED"

export interface Account {
  id: string
  name: string
  institutionName: string
  kind: AccountKind
  currencyCode: string
  balanceMinor: number
  availableBalanceMinor: number
  maskedNumber: string | null
  isPrimary: boolean
  status: AccountStatus
  archivedAtUtc: string | null
  disabledReason: string | null
}
