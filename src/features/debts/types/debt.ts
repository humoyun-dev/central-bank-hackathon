export type DebtDirection = "PAYABLE" | "RECEIVABLE"
export type DebtStatus = "OPEN" | "PARTIAL" | "SETTLED"

export interface Debt {
  id: string
  counterpartyName: string
  direction: DebtDirection
  currencyCode: string
  originalAmountMinor: number
  remainingAmountMinor: number
  description: string | null
  createdAtUtc: string
  dueAtUtc: string | null
  status: DebtStatus
}
