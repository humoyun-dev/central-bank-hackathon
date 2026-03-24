export interface DashboardAnalyticsPoint {
  label: string
  incomeMinor: number
  expenseMinor: number
}

export interface DashboardAnalyticsPreview {
  period: "weekly" | "monthly"
  currencyCode: string
  currentBalanceMinor: number
  incomeMinor: number
  expenseMinor: number
  netChangeMinor: number
  points: DashboardAnalyticsPoint[]
}
