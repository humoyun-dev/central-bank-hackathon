import { AmountValue } from "@/components/shared/amount-value"
import { EmptyState } from "@/components/shared/empty-state"
import { PageHeader } from "@/components/shared/page-header"
import { SectionCard } from "@/components/shared/section-card"
import { Badge } from "@/components/ui/badge"
import { BudgetForm } from "@/features/budgets/components/budget-form"
import type { Budget } from "@/features/budgets/types/budget"
import type { Category } from "@/features/categories/types/category"
import type { HouseholdContext } from "@/types/household"

export function BudgetsScreen({
  household,
  budgets,
  categories,
}: {
  household: HouseholdContext
  budgets: Budget[]
  categories: Category[]
}) {
  const expenseCategories = categories.filter((category) => category.kind === "EXPENSE")

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Budgets"
        title={`${household.name} budget controls`}
        description="Budget limits remain category-scoped and period-aware so later progress APIs can slot in without UI churn."
        actions={<Badge variant="primary">{budgets.length} active limits</Badge>}
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <SectionCard
          title="Budget progress"
          description="Spending stays anchored to minor-unit calculations and consistent category mapping."
        >
          {budgets.length === 0 ? (
            <EmptyState
              title="No budgets configured"
              description="Set a category limit to start tracking budget progress."
            />
          ) : (
            <div className="space-y-4">
              {budgets.map((budget) => {
                const progress =
                  budget.limitMinor > 0
                    ? Math.min(100, Math.max(0, (budget.spentMinor / budget.limitMinor) * 100))
                    : 0

                return (
                  <article
                    key={budget.id}
                    className="rounded-[1.2rem] border border-border/70 bg-card/75 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-base font-semibold text-foreground">
                            {budget.categoryName}
                          </h2>
                          <Badge variant="neutral">{budget.period}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Effective from {budget.effectiveFromLocalDate}
                        </p>
                      </div>
                      <AmountValue
                        amountMinor={budget.remainingMinor}
                        currencyCode={budget.currencyCode}
                        size="compact"
                      />
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Spent</span>
                        <span>{progress.toFixed(0)}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-primary transition-[width]"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                        <AmountValue
                          amountMinor={-budget.spentMinor}
                          currencyCode={budget.currencyCode}
                          size="compact"
                        />
                        <AmountValue
                          amountMinor={budget.limitMinor}
                          currencyCode={budget.currencyCode}
                          size="compact"
                          className="text-muted-foreground"
                        />
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Budget limit"
          description="Reuse an existing category and period to update the saved budget."
        >
          <BudgetForm householdId={household.id} categories={expenseCategories} budgets={budgets} />
        </SectionCard>
      </div>
    </div>
  )
}
