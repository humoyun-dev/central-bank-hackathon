import { notFound } from "next/navigation"
import { AnalyticsScreen } from "@/features/analytics/components/analytics-screen"
import {
  getAnalyticsSnapshot,
} from "@/features/analytics/api/get-analytics-snapshot"
import type { AnalyticsPeriod } from "@/features/analytics/types/analytics"
import { getHouseholdContext } from "@/features/households/api/get-household-context"

function parsePeriod(value: string | string[] | undefined): AnalyticsPeriod {
  return value === "7d" || value === "90d" ? value : "30d"
}

export default async function AnalyticsPage({
  params,
  searchParams,
}: {
  params: Promise<{ householdId: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const [{ householdId }, resolvedSearchParams] = await Promise.all([params, searchParams])
  const period = parsePeriod(resolvedSearchParams.period)

  const [household, analytics] = await Promise.all([
    getHouseholdContext(householdId),
    getAnalyticsSnapshot(householdId, period),
  ])

  if (!household) {
    notFound()
  }

  return <AnalyticsScreen household={household} analytics={analytics} />
}
