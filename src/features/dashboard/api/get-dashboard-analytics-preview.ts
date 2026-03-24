import "server-only"
import { mapDashboardAnalyticsPreviewDto } from "@/features/dashboard/mappers/map-dashboard-analytics-preview-dto"
import { dashboardAnalyticsPreviewDtoSchema } from "@/features/dashboard/schemas/dashboard-analytics-preview.dto"
import { getMockAnalyticsPreviewDto } from "@/services/api/mock/store"
import { serverApiRequest } from "@/services/api/server/client"
import { apiEndpoints } from "@/services/api/shared/endpoints"
import { publicEnv } from "@/services/config/public-env"

async function getDashboardAnalyticsPreviewInternal(
  householdId: string,
  period: "weekly" | "monthly" = "weekly",
) {
  const parsedDto = publicEnv.enableMockApi
    ? dashboardAnalyticsPreviewDtoSchema.parse(
        getMockAnalyticsPreviewDto(householdId, period),
      )
    : await serverApiRequest({
        path: apiEndpoints.households.analyticsPreview(householdId),
        schema: dashboardAnalyticsPreviewDtoSchema,
        householdId,
      })

  return mapDashboardAnalyticsPreviewDto(parsedDto)
}

export async function getDashboardAnalyticsPreview(
  householdId: string,
  period: "weekly" | "monthly" = "weekly",
) {
  return getDashboardAnalyticsPreviewInternal(householdId, period)
}
