import Link from "next/link"
import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AppLogo } from "@/components/shared/app-logo"
import { cn } from "@/lib/utils"
import { UserMenu } from "@/features/auth/components/user-menu"
import type { AuthSession } from "@/features/auth/types/session"
import type { HouseholdContext } from "@/types/household"

export function DashboardTopbar({
  household,
  session,
  mockMode,
}: {
  household: HouseholdContext
  session: AuthSession
  mockMode: boolean
}) {
  const displayName = household.name.split(" ")[0] ?? household.name

  return (
    <header className="shrink-0 border-b border-border/60 bg-[#fcfbf7]/96 px-3 py-3 backdrop-blur sm:px-4 lg:px-5">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-start gap-3">
          <AppLogo withWordmark={false} className="lg:hidden" />
          <div className="space-y-1">
            <h1 className="text-[2rem] font-semibold tracking-tight text-slate-950">
              Hello, {displayName}!
            </h1>
            <p className="max-w-xl text-sm leading-5 text-slate-500">
              All information about your household accounts lives in the sections
              below.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <form action={`/${household.id}/transactions`} className="min-w-0 sm:w-[16rem] lg:w-[18rem] xl:w-[20rem]">
            <label className="relative block">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <input
                type="search"
                name="query"
                aria-label="Search household activity"
                placeholder="Search transactions"
                className="h-11 w-full rounded-full border border-slate-200 bg-[#f2f1ee] pl-11 pr-4 text-sm outline-none transition-shadow placeholder:text-slate-400 focus-visible:ring-4 focus-visible:ring-primary/10"
              />
            </label>
          </form>
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled
              title="Notification center is not available in this phase."
              className={cn(
                "relative inline-flex size-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-60",
                mockMode ? "after:absolute after:right-3 after:top-3 after:size-2 after:rounded-full after:bg-rose-400" : "",
              )}
              aria-label="Notifications unavailable"
            >
              <Bell className="size-4" aria-hidden="true" />
            </button>
            <UserMenu
              fullName={session.user.fullName}
              email={session.user.email}
              householdId={household.id}
            />
          </div>
          <Button asChild variant="outline" className="hidden xl:inline-flex">
            <Link href="/select-household">Switch household</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
