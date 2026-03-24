import Link from "next/link"
import { CalendarDays, ChevronRight, ChartColumn } from "lucide-react"
import { AmountValue } from "@/components/shared/amount-value"
import { StatusBadge } from "@/components/shared/status-badge"
import { SectionHeader } from "@/components/shared/section-header"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatSignedMoney } from "@/lib/format/money"
import type { DashboardAnalyticsPreview } from "@/features/dashboard/types/dashboard-analytics-preview"

export function StatisticsPanel({
  analyticsPreview,
  householdId,
}: {
  analyticsPreview: DashboardAnalyticsPreview
  householdId: string
}) {
  const maxBarValue = Math.max(
    ...analyticsPreview.points.flatMap((point) => [point.incomeMinor, point.expenseMinor]),
    1,
  )

  return (
    <section className="space-y-4">
      <SectionHeader
        title="Statistics"
        action={
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
        }
      />
      <div className="surface-card space-y-5 rounded-[1.75rem] bg-white/90 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <AmountValue
              amountMinor={analyticsPreview.currentBalanceMinor}
              currencyCode={analyticsPreview.currencyCode}
              size="hero"
              className="text-slate-950"
            />
            <p className="mt-1 text-sm text-slate-500">
              {analyticsPreview.period === "weekly" ? "Weekly" : "Monthly"} movement for{" "}
              {analyticsPreview.currencyCode} household cash
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="rounded-full bg-[#f7f6f1]">
            <Link href={`/${householdId}/transactions`}>
              Details
              <ChevronRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
        <div className="grid h-56 grid-cols-7 items-end gap-3">
          {analyticsPreview.points.map((point, index) => {
            const incomeValue = point.incomeMinor
            const spendValue = point.expenseMinor
            const incomeHeight = incomeValue === 0 ? 10 : Math.max((incomeValue / maxBarValue) * 100, 14)
            const expenseHeight =
              spendValue === 0 ? 10 : Math.max((spendValue / maxBarValue) * 100, 14)

            return (
              <div key={`${point.label}-${index}`} className="flex flex-col items-center gap-3">
                <div className="flex h-44 items-end gap-2">
                  <span
                    className="w-5 rounded-full bg-[#b7c7ff]"
                    style={{
                      height: `${incomeHeight}%`,
                    }}
                  />
                  <span
                    className="w-5 rounded-full bg-slate-950"
                    style={{
                      height: `${expenseHeight}%`,
                    }}
                  />
                </div>
                <span className="text-xs font-medium text-slate-500">{point.label}</span>
              </div>
            )
          })}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-[1.25rem] bg-[#f7f6f1] p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Income
              </p>
              <StatusBadge label="Inflow" tone="success" />
            </div>
            <p className="mt-2 text-financial text-base font-semibold text-slate-950">
              {formatSignedMoney(analyticsPreview.incomeMinor, analyticsPreview.currencyCode)}
            </p>
          </div>
          <div className="rounded-[1.25rem] bg-[#f7f6f1] p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Expenses
              </p>
              <StatusBadge label="Outflow" tone="warning" />
            </div>
            <p className={cn("mt-2 text-financial text-base font-semibold text-slate-950")}>
              {formatSignedMoney(-analyticsPreview.expenseMinor, analyticsPreview.currencyCode)}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
