"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ArrowLeftRight,
  Home,
  Settings2,
  Store,
  Wallet2,
} from "lucide-react"
import { AppLogo } from "@/components/shared/app-logo"
import { cn } from "@/lib/utils"
import type { MembershipRole } from "@/types/household"

interface DashboardNavigationProps {
  householdId: string
  role: MembershipRole
}

function isActiveRoute(pathname: string, href: string) {
  if (pathname === href) {
    return true
  }

  const pathSegments = href.split("/").filter(Boolean)

  if (pathSegments.length === 1) {
    return false
  }

  return pathname.startsWith(`${href}/`)
}

export function DashboardNavigation({
  householdId,
  role,
}: DashboardNavigationProps) {
  const pathname = usePathname()
  const activeItems = [
    {
      label: "Home",
      href: `/${householdId}`,
      icon: Home,
    },
    {
      label: "Wallet",
      href: `/${householdId}/accounts`,
      icon: Wallet2,
    },
    {
      label: "Transfer",
      href: `/${householdId}/transactions`,
      icon: ArrowLeftRight,
    },
  ]
  const plannedItems = [
    { label: "Marketplace", icon: Store },
    { label: role === "OWNER" || role === "ADMIN" ? "Settings" : "Read-only", icon: Settings2 },
  ]

  return (
    <>
      <aside className="hidden w-[15rem] shrink-0 bg-[#c9d6ff] text-slate-950 lg:flex lg:flex-col xl:w-[15.5rem]">
        <div className="flex h-full flex-col px-5 py-5">
          <div className="pb-8">
            <AppLogo withWordmark={false} />
          </div>
          <nav className="flex flex-1 flex-col justify-between">
            <ul className="space-y-3">
              {activeItems.map(({ href, icon: Icon, label }) => {
                const isActive = isActiveRoute(pathname, href)

                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={cn(
                        "flex items-center gap-3 rounded-full px-4 py-3 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-slate-950 text-white shadow-[0_14px_28px_rgba(15,23,42,0.22)]"
                          : "text-slate-700 hover:bg-white/60 hover:text-slate-950",
                      )}
                    >
                      <Icon className="size-4" aria-hidden="true" />
                      {label}
                    </Link>
                  </li>
                )
              })}
            </ul>
            <ul className="space-y-3 pb-4">
              {plannedItems.map(({ icon: Icon, label }) => (
                <li key={label}>
                  <div className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600">
                    <Icon className="size-4" aria-hidden="true" />
                    <span>{label}</span>
                  </div>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
      <nav className="fixed inset-x-4 bottom-4 z-30 rounded-[var(--radius-lg)] border-2 border-slate-950/90 bg-card/95 p-2 shadow-lg backdrop-blur lg:hidden">
        <ul className="grid grid-cols-3 gap-2">
          {activeItems.map(({ href, icon: Icon, label }) => {
            const isActive = isActiveRoute(pathname, href)

            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-[var(--radius-md)] px-3 py-2 text-xs font-medium transition-colors",
                    isActive
                      ? "bg-slate-950 text-white"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </>
  )
}
