import { getTranslations } from "next-intl/server"
import { EmptyState } from "@/components/shared/empty-state"
import { ErrorState } from "@/components/shared/error-state"
import { SectionHeader } from "@/components/shared/section-header"
import { Button } from "@/components/ui/button"
import { getDashboardAnalyticsPreview } from "@/features/dashboard/api/get-dashboard-analytics-preview"
import { StatisticsPanel } from "@/features/dashboard/components/statistics-panel"
import { Link } from "@/i18n/navigation"
import { getErrorPresentation } from "@/lib/error-presentation"

export async function OverviewStatisticsSection({
  householdId,
}: {
  householdId: string
}) {
  const t = await getTranslations("dashboard.statistics")
  let analyticsPreview:
    | {
        weekly: Awaited<ReturnType<typeof getDashboardAnalyticsPreview>>
        monthly: Awaited<ReturnType<typeof getDashboardAnalyticsPreview>>
      }
    | null = null
  let copy:
    | ReturnType<typeof getErrorPresentation>
    | null = null

  try {
    const [weekly, monthly] = await Promise.all([
      getDashboardAnalyticsPreview(householdId, "weekly"),
      getDashboardAnalyticsPreview(householdId, "monthly"),
    ])
    analyticsPreview = { weekly, monthly }
  } catch (error) {
    copy = getErrorPresentation(error, {
      fallbackTitle: t("errorTitle"),
      fallbackDescription: t("errorDescription"),
    })
  }

  if (copy) {
    return (
      <section className="space-y-4">
        <SectionHeader title={t("title")} />
        <ErrorState
          title={copy.title}
          description={copy.description}
          action={
            <Button asChild variant="outline" className="rounded-full bg-white/70">
              <Link href={`/${householdId}/transactions`}>{t("inspectTransactions")}</Link>
            </Button>
          }
        />
      </section>
    )
  }

  if (
    analyticsPreview &&
    analyticsPreview.weekly.points.length === 0 &&
    analyticsPreview.monthly.points.length === 0
  ) {
    return (
      <section className="space-y-4">
        <SectionHeader title={t("title")} />
        <EmptyState
          title={t("emptyTitle")}
          description={t("emptyDescription")}
          action={
            <Button asChild variant="outline" className="rounded-full bg-white/70">
              <Link href={`/${householdId}/transactions`}>{t("reviewTransactions")}</Link>
            </Button>
          }
        />
      </section>
    )
  }

  return analyticsPreview ? (
    <StatisticsPanel
      analyticsPreview={analyticsPreview}
      householdId={householdId}
    />
  ) : null
}
