import Link from "next/link"
import { AmountValue } from "@/components/shared/amount-value"
import { EmptyState } from "@/components/shared/empty-state"
import { PageHeader } from "@/components/shared/page-header"
import { SectionCard } from "@/components/shared/section-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type {
  AnalyticsPeriod,
  AnalyticsSnapshot,
} from "@/features/analytics/types/analytics"
import type { HouseholdContext } from "@/types/household"

const periodOptions: AnalyticsPeriod[] = ["7d", "30d", "90d"]

export function AnalyticsScreen({
  household,
  analytics,
}: {
  household: HouseholdContext
  analytics: AnalyticsSnapshot
}) {
  const maxTrendValue = Math.max(
    1,
    ...analytics.trend.flatMap((point) => [point.incomeMinor, point.expenseMinor]),
  )
  const maxCalendarExpense = Math.max(1, ...analytics.calendar.map((day) => day.expenseMinor))
  const topCategorySpend = analytics.categories[0]?.spendMinor ?? 1

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Analytics"
        title={`${household.name} financial signal`}
        description="Summary cards, category concentration, and calendar intensity all read from the same server-owned transaction boundary."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {periodOptions.map((option) => (
              <Button
                key={option}
                asChild
                variant={analytics.period === option ? "default" : "outline"}
              >
                <Link href={`/${household.id}/analytics?period=${option}`}>{option}</Link>
              </Button>
            ))}
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <SectionCard title="Income" description={`Last ${analytics.period}`}>
          <AmountValue
            amountMinor={analytics.summary.incomeMinor}
            currencyCode={analytics.currencyCode}
            size="section"
            className="text-success-foreground"
          />
        </SectionCard>
        <SectionCard title="Expense" description={`Last ${analytics.period}`}>
          <AmountValue
            amountMinor={-analytics.summary.expenseMinor}
            currencyCode={analytics.currencyCode}
            size="section"
          />
        </SectionCard>
        <SectionCard title="Net change" description={`${analytics.summary.transactionCount} transactions`}>
          <AmountValue
            amountMinor={analytics.summary.netChangeMinor}
            currencyCode={analytics.currencyCode}
            size="section"
          />
        </SectionCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <SectionCard
          title="Flow trend"
          description="Income and expense intensity over the selected period."
        >
          {analytics.trend.length === 0 ? (
            <EmptyState
              title="No trend data"
              description="Record transactions to populate analytics."
            />
          ) : (
            <div className="grid h-[22rem] grid-cols-[repeat(auto-fit,minmax(1.5rem,1fr))] items-end gap-2">
              {analytics.trend.map((point, index) => (
                <div key={`${point.date}-${index}`} className="flex flex-col items-center gap-2">
                  <div className="flex h-full items-end gap-1">
                    <div
                      className="w-3 rounded-full bg-primary/35"
                      style={{ height: `${Math.max(6, (point.incomeMinor / maxTrendValue) * 100)}%` }}
                    />
                    <div
                      className="w-3 rounded-full bg-slate-950"
                      style={{ height: `${Math.max(6, (point.expenseMinor / maxTrendValue) * 100)}%` }}
                    />
                  </div>
                  <span className="text-[0.7rem] font-medium text-muted-foreground">
                    {point.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Category concentration"
          description="Top expense groups across the selected period."
        >
          {analytics.categories.length === 0 ? (
            <EmptyState
              title="No category breakdown"
              description="Expense activity is required before category analytics can render."
            />
          ) : (
            <div className="space-y-4">
              {analytics.categories.map((category) => (
                <article key={category.categoryName} className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <p className="text-sm font-semibold text-foreground">
                        {category.categoryName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {category.transactionCount} transactions
                      </p>
                    </div>
                    <AmountValue
                      amountMinor={-category.spendMinor}
                      currencyCode={analytics.currencyCode}
                      size="compact"
                    />
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{
                        width: `${Math.max(
                          8,
                          (category.spendMinor / topCategorySpend) * 100,
                        )}%`,
                      }}
                    />
                  </div>
                </article>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      <SectionCard
        title="Calendar intensity"
        description="Recent daily expense concentration for quick anomaly scanning."
      >
        {analytics.calendar.length === 0 ? (
          <EmptyState
            title="No calendar activity"
            description="Analytics calendar will populate after household transactions arrive."
          />
        ) : (
          <div className="grid grid-cols-7 gap-2">
            {analytics.calendar.map((day) => {
              const intensity = day.expenseMinor / maxCalendarExpense

              return (
                <div
                  key={day.date}
                  className="rounded-[1rem] border border-border/70 p-3"
                  style={{
                    backgroundColor: `rgba(82,122,188,${Math.max(0.08, intensity)})`,
                  }}
                >
                  <p className="text-xs font-semibold text-foreground">{day.date.slice(8)}</p>
                  <p className="mt-3 text-[0.7rem] text-slate-700">
                    {day.expenseMinor > 0 ? `${(day.expenseMinor / 100).toFixed(0)}` : "0"}
                  </p>
                  {day.incomeMinor > 0 ? (
                    <Badge variant="neutral" className="mt-2">
                      +{(day.incomeMinor / 100).toFixed(0)}
                    </Badge>
                  ) : null}
                </div>
              )
            })}
          </div>
        )}
      </SectionCard>
    </div>
  )
}
