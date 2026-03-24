import Link from "next/link"
import {
  ArrowDownLeft,
  ArrowUpRight,
  Lock,
  Plus,
  ReceiptText,
} from "lucide-react"
import { AmountValue } from "@/components/shared/amount-value"
import { Badge } from "@/components/ui/badge"
import { formatSignedMoney } from "@/lib/format/money"
import { getVisibleDashboardActions } from "@/lib/permissions"
import type { HouseholdContext } from "@/types/household"

export function BalanceHero({
  household,
}: {
  household: HouseholdContext
}) {
  const visibility = getVisibleDashboardActions(household.role)
  const actions = [
    {
      label: "Send",
      href: `/${household.id}/transactions`,
      icon: ArrowUpRight,
      visible: visibility.canInitiateTransfer,
    },
    {
      label: "Request",
      href: `/${household.id}/accounts`,
      icon: ArrowDownLeft,
      visible: visibility.canViewAccounts,
    },
    {
      label: "Split bill",
      href: `/${household.id}/transactions`,
      icon: ReceiptText,
      visible: visibility.canViewTransactions,
    },
    {
      label: "Top up",
      href: `/${household.id}/accounts`,
      icon: Plus,
      visible: visibility.canViewAccounts,
    },
  ]
  const netCashFlowMinor = household.monthIncomeMinor - household.monthSpendMinor

  return (
    <section className="overflow-hidden rounded-[2rem] bg-[#b9c8ff] p-6 text-slate-950 shadow-[0_18px_48px_rgba(96,119,185,0.18)] sm:p-8">
      <div className="space-y-7">
        <div className="space-y-3">
          <Badge className="border-slate-950/10 bg-white/55 text-slate-700">
            Available balance
          </Badge>
          <AmountValue
            amountMinor={household.availableBalanceMinor}
            currencyCode={household.currencyCode}
            size="hero"
            className="text-slate-950"
          />
          <p className="text-sm leading-6 text-slate-700">
            Available household cash across your active operating surfaces.
          </p>
        </div>
        <div className="flex flex-wrap gap-5">
          {actions.filter((action) => action.visible).map(({ href, icon: Icon, label }) => (
            <Link key={label} href={href} className="group flex flex-col items-center gap-2.5">
              <span className="flex size-12 items-center justify-center rounded-full bg-slate-950 text-white shadow-sm transition-transform group-hover:-translate-y-0.5">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <span className="text-xs font-medium text-slate-700">{label}</span>
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-700">
          <span className="rounded-full bg-white/55 px-3 py-2 text-financial">
            Net {formatSignedMoney(netCashFlowMinor, household.currencyCode)}
          </span>
          <span className="rounded-full bg-white/55 px-3 py-2">
            {household.memberCount} collaborators
          </span>
          {!visibility.canManageSettings ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-white/55 px-3 py-2">
              <Lock className="size-4" aria-hidden="true" />
              Read-only management scope
            </span>
          ) : null}
        </div>
      </div>
    </section>
  )
}
