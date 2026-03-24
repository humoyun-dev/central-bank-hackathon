import Link from "next/link"
import { CalendarDays, ChevronRight, ChartColumn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { HouseholdContext } from "@/types/household"

function createBarSeries(totalMinor: number, multipliers: number[]) {
  return multipliers.map((multiplier) =>
    Math.max(14, Math.round((totalMinor / 100) * multiplier)),
  )
}

export function StatisticsPanel({
  household,
}: {
  household: HouseholdContext
}) {
  const spendSeries = createBarSeries(household.monthSpendMinor, [
    0.14,
    0.32,
    0.26,
    0.22,
    0.27,
    0.38,
    0.18,
  ])
  const incomeSeries = createBarSeries(household.monthIncomeMinor, [
    0.2,
    0.16,
    0.1,
    0.18,
    0.42,
    0.08,
    0.24,
  ])
  const maxBarValue = Math.max(...spendSeries, ...incomeSeries)
  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-[2.35rem]">
          Statistics
        </h2>
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-full bg-[#f1efea] p-1 text-xs font-semibold text-slate-500">
            <span className="rounded-full bg-slate-950 px-4 py-2 text-white">Weekly</span>
            <span className="px-4 py-2">Monthly</span>
          </div>
          <div className="flex size-10 items-center justify-center rounded-full bg-[#f1efea] text-slate-600">
            <CalendarDays className="size-4" aria-hidden="true" />
          </div>
          <div className="flex size-10 items-center justify-center rounded-full bg-slate-950 text-white">
            <ChartColumn className="size-4" aria-hidden="true" />
          </div>
        </div>
      </div>
      <div className="surface-card space-y-5 rounded-[1.75rem] bg-white/90 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-financial text-4xl font-semibold tracking-tight text-slate-950">
              {(household.availableBalanceMinor / 100).toFixed(2)}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Weekly movement for {household.currencyCode} household cash
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="rounded-full bg-[#f7f6f1]">
            <Link href={`/${household.id}/transactions`}>
              Details
              <ChevronRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
        <div className="grid h-56 grid-cols-7 items-end gap-3">
          {dayLabels.map((day, index) => {
            const incomeValue = incomeSeries[index] ?? 0
            const spendValue = spendSeries[index] ?? 0

            return (
              <div key={day} className="flex flex-col items-center gap-3">
                <div className="flex h-44 items-end gap-2">
                  <span
                    className="w-5 rounded-full bg-[#b7c7ff]"
                    style={{
                      height: `${(incomeValue / maxBarValue) * 100}%`,
                    }}
                  />
                  <span
                    className="w-5 rounded-full bg-slate-950"
                    style={{
                      height: `${(spendValue / maxBarValue) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-xs font-medium text-slate-500">{day}</span>
              </div>
            )
          })}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-[1.25rem] bg-[#f7f6f1] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Income
            </p>
            <p className="mt-2 text-financial text-base font-semibold text-slate-950">
              +{(household.monthIncomeMinor / 100).toFixed(2)}
            </p>
          </div>
          <div className="rounded-[1.25rem] bg-[#f7f6f1] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Expenses
            </p>
            <p className={cn("mt-2 text-financial text-base font-semibold text-slate-950")}>
              -{(household.monthSpendMinor / 100).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
