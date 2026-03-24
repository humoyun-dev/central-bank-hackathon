import { AppLogo } from "@/components/shared/app-logo"
import {
  DesktopDashboardNavigationLinks,
  MobileDashboardNavigationLinks,
} from "@/components/shared/dashboard-navigation-links"
import type { MembershipRole } from "@/types/household"

export function DashboardNavigation({
  householdId,
  role,
}: {
  householdId: string
  role: MembershipRole
}) {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[15rem] border-r border-slate-900/10 bg-[#c9d6ff] text-slate-950 lg:flex lg:flex-col xl:w-[15.5rem]">
        <div className="flex min-h-0 h-full flex-col px-5 py-5">
          <div className="pb-8">
            <AppLogo withWordmark={false} />
          </div>
          <DesktopDashboardNavigationLinks householdId={householdId} role={role} />
        </div>
      </aside>
      <MobileDashboardNavigationLinks householdId={householdId} />
    </>
  )
}
