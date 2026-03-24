import Link from "next/link"
import { EmptyState } from "@/components/shared/empty-state"
import { ErrorState } from "@/components/shared/error-state"
import { SectionHeader } from "@/components/shared/section-header"
import { Button } from "@/components/ui/button"
import { getDashboardAnalyticsPreview } from "@/features/dashboard/api/get-dashboard-analytics-preview"
import { StatisticsPanel } from "@/features/dashboard/components/statistics-panel"
import { getErrorPresentation } from "@/lib/error-presentation"

export async function OverviewStatisticsSection({
  householdId,
}: {
  householdId: string
}) {
  let analyticsPreview: Awaited<ReturnType<typeof getDashboardAnalyticsPreview>> | null = null
  let copy:
    | ReturnType<typeof getErrorPresentation>
    | null = null

  try {
    analyticsPreview = await getDashboardAnalyticsPreview(householdId)
  } catch (error) {
    copy = getErrorPresentation(error, {
      fallbackTitle: "Statistics preview unavailable",
      fallbackDescription:
        "The analytics summary could not be loaded for this household right now.",
    })
  }

  if (copy) {
    return (
      <section className="space-y-4">
        <SectionHeader title="Statistics" />
        <ErrorState
          title={copy.title}
          description={copy.description}
          action={
            <Button asChild variant="outline" className="rounded-full bg-white/70">
              <Link href={`/${householdId}/transactions`}>Inspect transactions</Link>
            </Button>
          }
        />
      </section>
    )
  }

  if (analyticsPreview && analyticsPreview.points.length === 0) {
    return (
      <section className="space-y-4">
        <SectionHeader title="Statistics" />
        <EmptyState
          title="No analytics available yet"
          description="Analytics preview cards will become available once the household has enough recorded financial activity."
          action={
            <Button asChild variant="outline" className="rounded-full bg-white/70">
              <Link href={`/${householdId}/transactions`}>Review transactions</Link>
            </Button>
          }
        />
      </section>
    )
  }

  return analyticsPreview ? (
    <StatisticsPanel analyticsPreview={analyticsPreview} householdId={householdId} />
  ) : null
}
