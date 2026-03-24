import { Suspense } from "react"
import { BalanceHero } from "@/features/dashboard/components/balance-hero"
import { DashboardActionCenterSection } from "@/features/dashboard/components/dashboard-action-center-section"
import { DashboardSectionSkeleton } from "@/features/dashboard/components/dashboard-section-skeleton"
import { OverviewActivitySection } from "@/features/dashboard/components/overview-activity-section"
import { OverviewStatisticsSection } from "@/features/dashboard/components/overview-statistics-section"
import { OverviewWalletSection } from "@/features/dashboard/components/overview-wallet-section"
import { QuickTransferPanel } from "@/features/dashboard/components/quick-transfer-panel"
import type { HouseholdContext } from "@/types/household"

export function DashboardOverviewScreen({
  household,
  householdId,
}: {
  household: HouseholdContext
  householdId: string
}) {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)]">
        <div className="space-y-5">
          <BalanceHero household={household} />
          <Suspense
            fallback={
              <DashboardSectionSkeleton titleWidth="w-44" rowCount={1} cardHeight="h-60" />
            }
          >
            <DashboardActionCenterSection household={household} />
          </Suspense>
          <Suspense
            fallback={
              <DashboardSectionSkeleton titleWidth="w-44" rowCount={1} cardHeight="h-40" />
            }
          >
            <QuickTransferPanel household={household} />
          </Suspense>
          <Suspense
            fallback={
              <DashboardSectionSkeleton titleWidth="w-56" rowCount={3} cardHeight="h-24" />
            }
          >
            <OverviewActivitySection householdId={householdId} />
          </Suspense>
        </div>
        <div className="space-y-5">
          <Suspense
            fallback={
              <DashboardSectionSkeleton titleWidth="w-40" rowCount={2} cardHeight="h-48" />
            }
          >
            <OverviewWalletSection householdId={householdId} />
          </Suspense>
          <Suspense
            fallback={
              <DashboardSectionSkeleton titleWidth="w-52" rowCount={1} cardHeight="h-[28rem]" />
            }
          >
            <OverviewStatisticsSection householdId={householdId} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
