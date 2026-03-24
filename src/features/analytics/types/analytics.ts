export type AnalyticsPeriod = "7d" | "30d" | "90d"

export interface AnalyticsSummary {
  incomeMinor: number
  expenseMinor: number
  netChangeMinor: number
  transactionCount: number
}

export interface AnalyticsTrendPoint {
  date: string
  label: string
  incomeMinor: number
  expenseMinor: number
}

export interface AnalyticsCategoryBreakdown {
  categoryName: string
  spendMinor: number
  transactionCount: number
}

export interface AnalyticsCalendarDay {
  date: string
  expenseMinor: number
  incomeMinor: number
}

export interface AnalyticsSnapshot {
  period: AnalyticsPeriod
  currencyCode: string
  summary: AnalyticsSummary
  trend: AnalyticsTrendPoint[]
  categories: AnalyticsCategoryBreakdown[]
  calendar: AnalyticsCalendarDay[]
}
