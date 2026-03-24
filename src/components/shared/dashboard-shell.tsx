import { DashboardNavigation } from "@/components/shared/dashboard-navigation"
import { DashboardTopbar } from "@/components/shared/dashboard-topbar"
import { publicEnv } from "@/services/config/public-env"
import type { HouseholdContext } from "@/types/household"

export function DashboardShell({
  household,
  children,
}: {
  household: HouseholdContext
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen px-1.5 py-1.5 sm:px-2.5 sm:py-2.5 lg:px-3 lg:py-3">
      <div className="mx-auto w-full max-w-[1720px]">
        <div className="dashboard-frame flex min-h-[calc(100vh-0.75rem)] flex-col lg:min-h-[calc(100vh-1.5rem)] lg:flex-row">
          <DashboardNavigation householdId={household.id} role={household.role} />
          <div className="flex min-h-full min-w-0 flex-1 flex-col bg-[#fcfbf7]">
            <DashboardTopbar household={household} mockMode={publicEnv.enableMockApi} />
            <main className="flex-1 px-3 pb-24 pt-3 sm:px-4 lg:px-5 lg:pb-6 lg:pt-4">
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}
