"use client"

import { CalendarDays, ChevronRight, ChartColumn } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useState } from "react"
import { AmountValue } from "@/components/shared/amount-value"
import { StatusBadge } from "@/components/shared/status-badge"
import { SectionHeader } from "@/components/shared/section-header"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Link } from "@/i18n/navigation"
import { formatSignedMoney } from "@/lib/format/money"
import type { DashboardAnalyticsPreview } from "@/features/dashboard/types/dashboard-analytics-preview"

export function StatisticsPanel({
  analyticsPreview,
  householdId,
}: {
  analyticsPreview: {
    weekly: DashboardAnalyticsPreview
    monthly: DashboardAnalyticsPreview
  }
  householdId: string
}) {
  const locale = useLocale()
  const t = useTranslations("dashboard.statistics")
  const [period, setPeriod] = useState<"weekly" | "monthly">("weekly")
  const activePreview = analyticsPreview[period]
  const maxBarValue = Math.max(
    ...activePreview.points.flatMap((point) => [point.incomeMinor, point.expenseMinor]),
    1,
  )

  return (
    <section className="space-y-4">
      <SectionHeader
        title={t("title")}
        action={
          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-full bg-[#f1efea] p-1 text-xs font-semibold text-slate-500">
              <button
                type="button"
                className={cn(
                  "rounded-full px-4 py-2 transition-colors",
                  period === "weekly" ? "bg-slate-950 text-white" : "text-slate-500",
                )}
                onClick={() => setPeriod("weekly")}
              >
                {t("period.weekly")}
              </button>
              <button
                type="button"
                className={cn(
                  "rounded-full px-4 py-2 transition-colors",
                  period === "monthly" ? "bg-slate-950 text-white" : "text-slate-500",
                )}
                onClick={() => setPeriod("monthly")}
              >
                {t("period.monthly")}
              </button>
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
              amountMinor={activePreview.currentBalanceMinor}
              currencyCode={activePreview.currencyCode}
              size="hero"
              locale={locale}
              className="text-slate-950"
            />
            <p className="mt-1 text-sm text-slate-500">
              {t("movementCaption", {
                period:
                  activePreview.period === "weekly"
                    ? t("period.weekly")
                    : t("period.monthly"),
                currencyCode: activePreview.currencyCode,
              })}
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="rounded-full bg-[#f7f6f1]">
            <Link href={`/${householdId}/analytics`}>
              {t("details")}
              <ChevronRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
        <div
          className={cn(
            "grid h-56 items-end gap-3",
            activePreview.points.length === 4 ? "grid-cols-4" : "grid-cols-7",
          )}
        >
          {activePreview.points.map((point, index) => {
            const incomeValue = point.incomeMinor
            const spendValue = point.expenseMinor
            const incomeHeight =
              incomeValue === 0 ? 10 : Math.max((incomeValue / maxBarValue) * 100, 14)
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
                {t("income")}
              </p>
              <StatusBadge label={t("inflow")} tone="success" />
            </div>
            <p className="mt-2 text-financial text-base font-semibold text-slate-950">
              {formatSignedMoney(activePreview.incomeMinor, activePreview.currencyCode, {
                locale,
              })}
            </p>
          </div>
          <div className="rounded-[1.25rem] bg-[#f7f6f1] p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                {t("expenses")}
              </p>
              <StatusBadge label={t("outflow")} tone="warning" />
            </div>
            <p className={cn("mt-2 text-financial text-base font-semibold text-slate-950")}>
              {formatSignedMoney(-activePreview.expenseMinor, activePreview.currencyCode, {
                locale,
              })}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
