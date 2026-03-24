export type BudgetPeriod = "MONTHLY" | "WEEKLY"

export interface Budget {
  id: string
  categoryId: string
  categoryName: string
  period: BudgetPeriod
  currencyCode: string
  limitMinor: number
  spentMinor: number
  remainingMinor: number
  effectiveFromLocalDate: string
}
