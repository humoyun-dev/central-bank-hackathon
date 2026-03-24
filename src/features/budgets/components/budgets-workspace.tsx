"use client"

import { PencilLine, PiggyBank, Plus } from "lucide-react"
import { useMemo, useState } from "react"
import { ActionMenu } from "@/components/shared/action-menu"
import { AmountValue } from "@/components/shared/amount-value"
import { EmptyState } from "@/components/shared/empty-state"
import { FormDialog } from "@/components/shared/forms/form-dialog"
import { PageHeader } from "@/components/shared/page-header"
import { SectionCard } from "@/components/shared/section-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BudgetForm } from "@/features/budgets/components/budget-form"
import type { Budget, BudgetPeriod } from "@/features/budgets/types/budget"
import type { Category } from "@/features/categories/types/category"
import { hasPermission } from "@/lib/permissions"
import type { HouseholdContext } from "@/types/household"

type BudgetView = "ALL" | BudgetPeriod

export function BudgetsWorkspace({
  household,
  budgets,
  categories,
}: {
  household: HouseholdContext
  budgets: Budget[]
  categories: Category[]
}) {
  const [view, setView] = useState<BudgetView>("ALL")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editedBudgetId, setEditedBudgetId] = useState<string | null>(null)
  const canManageBudgets = hasPermission(household.role, "manageBudgets")
  const expenseCategories = categories.filter((category) => category.kind === "EXPENSE")

  const filteredBudgets = useMemo(() => {
    if (view === "ALL") {
      return budgets
    }

    return budgets.filter((budget) => budget.period === view)
  }, [budgets, view])

  const editedBudget =
    budgets.find((budget) => budget.id === editedBudgetId) ?? null

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Budgets"
        title={`${household.name} budget controls`}
        description="Budget limits stay dialog-driven, category-scoped, and period-aware for a low-noise planning workspace."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary">{budgets.length} active limits</Badge>
            {canManageBudgets ? (
              <Button
                type="button"
                disabled={expenseCategories.length === 0}
                title={
                  expenseCategories.length === 0
                    ? "Create an expense category first."
                    : undefined
                }
                onClick={() => setIsCreateOpen(true)}
              >
                <Plus className="size-4" aria-hidden="true" />
                New budget
              </Button>
            ) : null}
          </div>
        }
      />

      <Tabs value={view} onValueChange={(nextValue) => setView(nextValue as BudgetView)}>
        <TabsList>
          <TabsTrigger value="ALL">All</TabsTrigger>
          <TabsTrigger value="MONTHLY">Monthly</TabsTrigger>
          <TabsTrigger value="WEEKLY">Weekly</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <SectionCard
          title="Budget progress"
          description="Spending stays anchored to minor-unit calculations and consistent category mapping."
        >
          {filteredBudgets.length === 0 ? (
            <EmptyState
              title="No budgets configured for this view"
              description="Create a category limit to start tracking budget progress."
              action={
                canManageBudgets ? (
                  <Button type="button" onClick={() => setIsCreateOpen(true)}>
                    Create budget
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <div className="space-y-4">
              {filteredBudgets.map((budget) => {
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
                      <div className="flex items-start gap-2">
                        {canManageBudgets ? (
                          <ActionMenu
                            label={`${budget.categoryName} budget actions`}
                            items={[
                              {
                                label: "Edit budget",
                                icon: <PencilLine className="size-4" aria-hidden="true" />,
                                onSelect: () => setEditedBudgetId(budget.id),
                              },
                            ]}
                          />
                        ) : null}
                        <AmountValue
                          amountMinor={budget.remainingMinor}
                          currencyCode={budget.currencyCode}
                          size="compact"
                        />
                      </div>
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
          title="Budget controls"
          description="Use dialogs for create and edit flows so the reading path stays compact."
        >
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>Weekly and monthly views are switchable through the tabs above.</p>
            <p>Reusing the same category and period updates the saved budget record.</p>
          </div>
          {canManageBudgets ? (
            <Button
              type="button"
              disabled={expenseCategories.length === 0}
              title={
                expenseCategories.length === 0
                  ? "Create an expense category first."
                  : undefined
              }
              onClick={() => setIsCreateOpen(true)}
            >
              <PiggyBank className="size-4" aria-hidden="true" />
              Create budget
            </Button>
          ) : (
            <EmptyState
              title="Budget mutations are limited"
              description="This membership can review budgets but cannot change them."
            />
          )}
        </SectionCard>
      </div>

      <FormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        title="Create budget"
        description="Set a weekly or monthly cap for an expense category."
      >
        <BudgetForm
          householdId={household.id}
          categories={expenseCategories}
          budgets={budgets}
          onCancel={() => setIsCreateOpen(false)}
          onSuccess={() => setIsCreateOpen(false)}
        />
      </FormDialog>

      <FormDialog
        open={Boolean(editedBudget)}
        onOpenChange={(open) => !open && setEditedBudgetId(null)}
        title={editedBudget ? `Edit ${editedBudget.categoryName} budget` : "Edit budget"}
        description="Adjust the saved period cap while keeping the existing category scope."
      >
        {editedBudget ? (
          <BudgetForm
            householdId={household.id}
            categories={expenseCategories}
            budgets={budgets}
            initialBudget={editedBudget}
            onCancel={() => setEditedBudgetId(null)}
            onSuccess={() => setEditedBudgetId(null)}
          />
        ) : null}
      </FormDialog>
    </div>
  )
}
