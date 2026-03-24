import { DashboardNavigation } from "@/components/shared/dashboard-navigation"
import { DashboardTopbar } from "@/components/shared/dashboard-topbar"
import type { AuthSession } from "@/features/auth/types/session"
import { publicEnv } from "@/services/config/public-env"
import type { HouseholdContext } from "@/types/household"

export async function DashboardShell({
  household,
  session,
  children,
}: {
  household: HouseholdContext
  session: AuthSession
  children: React.ReactNode
}) {
  return (
    <div className="relative h-dvh w-full overflow-hidden bg-[#eef3ff] lg:pl-[15rem] xl:pl-[15.5rem]">
      <DashboardNavigation householdId={household.id} role={household.role} />
      <div className="flex h-dvh min-w-0 w-full flex-col overflow-hidden bg-[#fcfbf7]">
        <DashboardTopbar
          household={household}
          session={session}
          mockMode={publicEnv.enableMockApi}
        />
        <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-24 pt-3 sm:px-4 lg:px-5 lg:pb-6 lg:pt-4">
          {children}
        </main>
      </div>
    </div>
  )
}
