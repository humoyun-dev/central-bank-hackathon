import Link from "next/link"
import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AppLogo } from "@/components/shared/app-logo"
import { cn } from "@/lib/utils"
import type { HouseholdContext } from "@/types/household"

export function DashboardTopbar({
  household,
  mockMode,
}: {
  household: HouseholdContext
  mockMode: boolean
}) {
  const displayName = household.name.split(" ")[0] ?? household.name
  const initials = household.name
    .split(" ")
    .map((item) => item[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <header className="sticky top-0 z-20 bg-[#fcfbf7]/94 px-3 py-3 backdrop-blur sm:px-4 lg:px-5">
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
          <label className="relative block min-w-0 sm:w-[16rem] lg:w-[18rem] xl:w-[20rem]">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              type="search"
              aria-label="Search dashboard"
              placeholder="Search something"
              className="h-11 w-full rounded-full border border-slate-200 bg-[#f2f1ee] pl-11 pr-4 text-sm outline-none transition-shadow placeholder:text-slate-400 focus-visible:ring-4 focus-visible:ring-primary/10"
            />
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className={cn(
                "relative inline-flex size-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-50",
                mockMode ? "after:absolute after:right-3 after:top-3 after:size-2 after:rounded-full after:bg-rose-400" : "",
              )}
              aria-label="Notifications"
            >
              <Bell className="size-4" aria-hidden="true" />
            </button>
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#1f2937,#3b82f6)] text-sm font-semibold text-white shadow-sm">
                {initials}
              </div>
              <div className="hidden min-w-0 xl:block">
                <p className="truncate text-sm font-semibold text-slate-950">
                  {household.name}
                </p>
                <p className="truncate text-xs text-slate-500">
                  {household.role} · {household.currencyCode}
                </p>
              </div>
            </div>
          </div>
          <Button asChild variant="outline" className="hidden xl:inline-flex">
            <Link href="/select-household">Switch household</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
