"use client"

import { useTranslations } from "next-intl"
import {
  ArrowLeftRight,
  BarChart3,
  FolderKanban,
  Home,
  Landmark,
  PiggyBank,
  Settings2,
  Wallet2,
} from "lucide-react"
import { Link, usePathname } from "@/i18n/navigation"
import { cn } from "@/lib/utils"
import type { MembershipRole } from "@/types/household"

function isActiveRoute(pathname: string, href: string) {
  if (pathname === href) {
    return true
  }

  const pathSegments = href.split("/").filter(Boolean)

  if (pathSegments.length === 1) {
    return false
  }

  return pathname.startsWith(`${href}/`) || pathname.endsWith(href)
}

function getPrimaryItems(householdId: string, t: (key: string) => string) {
  return [
    {
      label: t("home"),
      href: `/${householdId}`,
      icon: Home,
    },
    {
      label: t("wallet"),
      href: `/${householdId}/accounts`,
      icon: Wallet2,
    },
    {
      label: t("transactions"),
      href: `/${householdId}/transactions`,
      icon: ArrowLeftRight,
    },
    {
      label: t("categories"),
      href: `/${householdId}/categories`,
      icon: FolderKanban,
    },
    {
      label: t("debts"),
      href: `/${householdId}/debts`,
      icon: Landmark,
    },
    {
      label: t("budgets"),
      href: `/${householdId}/budgets`,
      icon: PiggyBank,
    },
    {
      label: t("analytics"),
      href: `/${householdId}/analytics`,
      icon: BarChart3,
    },
  ]
}

function getFooterItems(
  householdId: string,
  role: MembershipRole,
  t: (key: string) => string,
) {
  return [
    {
      label: role === "OWNER" || role === "ADMIN" ? t("settings") : t("household"),
      href: `/${householdId}/settings`,
      icon: Settings2,
    },
  ]
}

export function DesktopDashboardNavigationLinks({
  householdId,
  role,
}: {
  householdId: string
  role: MembershipRole
}) {
  const t = useTranslations("navigation")
  const pathname = usePathname()
  const primaryItems = getPrimaryItems(householdId, t)
  const footerItems = getFooterItems(householdId, role, t)

  return (
    <nav className="flex min-h-0 flex-1 flex-col justify-between overflow-y-auto">
      <ul className="space-y-3">
        {primaryItems.map(({ href, icon: Icon, label }) => {
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
        {footerItems.map(({ href, icon: Icon, label }) => {
          const isActive = isActiveRoute(pathname, href)

          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-slate-950 text-white shadow-[0_14px_28px_rgba(15,23,42,0.22)]"
                    : "text-slate-600 hover:bg-white/60 hover:text-slate-950",
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
                <span>{label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export function MobileDashboardNavigationLinks({
  householdId,
}: {
  householdId: string
}) {
  const t = useTranslations("navigation")
  const pathname = usePathname()
  const mobileItems = getPrimaryItems(householdId, t).filter((item) =>
    [
      `/${householdId}`,
      `/${householdId}/accounts`,
      `/${householdId}/transactions`,
      `/${householdId}/analytics`,
    ].includes(item.href),
  )

  return (
    <nav className="fixed inset-x-4 bottom-4 z-40 rounded-[var(--radius-lg)] border border-border/70 bg-card/95 p-2 shadow-lg backdrop-blur lg:hidden">
      <ul className="grid grid-cols-4 gap-2">
        {mobileItems.map(({ href, icon: Icon, label }) => {
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
  )
}
