import type {
  DashboardAnalyticsPreview,
  DashboardAnalyticsPoint,
} from "@/features/dashboard/types/dashboard-analytics-preview"
import type { DashboardAnalyticsPreviewDto } from "@/features/dashboard/schemas/dashboard-analytics-preview.dto"

function mapDashboardAnalyticsPoint(
  point: DashboardAnalyticsPreviewDto["points"][number],
): DashboardAnalyticsPoint {
  return {
    label: point.label,
    incomeMinor: point.income_minor,
    expenseMinor: point.expense_minor,
  }
}

export function mapDashboardAnalyticsPreviewDto(
  previewDto: DashboardAnalyticsPreviewDto,
): DashboardAnalyticsPreview {
  return {
    period: previewDto.period,
    currencyCode: previewDto.currency_code,
    currentBalanceMinor: previewDto.current_balance_minor,
    incomeMinor: previewDto.income_minor,
    expenseMinor: previewDto.expense_minor,
    netChangeMinor: previewDto.net_change_minor,
    points: previewDto.points.map(mapDashboardAnalyticsPoint),
  }
}
