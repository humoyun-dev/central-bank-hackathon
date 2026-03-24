"use client"

import { PencilLine, PiggyBank, Plus } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
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
import { formatDateByLocale } from "@/lib/format/date"
import { formatNumberByLocale } from "@/lib/format/number"
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
  const locale = useLocale()
  const t = useTranslations("budgets.workspace")
  const tCommon = useTranslations("budgets.common")
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
        eyebrow={t("eyebrow")}
        title={t("title", { household: household.name })}
        description={t("description")}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary">{t("activeLimits", { count: budgets.length })}</Badge>
            {canManageBudgets ? (
              <Button
                type="button"
                disabled={expenseCategories.length === 0}
                title={
                  expenseCategories.length === 0
                    ? t("requirements.expenseCategory")
                    : undefined
                }
                onClick={() => setIsCreateOpen(true)}
              >
                <Plus className="size-4" aria-hidden="true" />
                {t("actions.newBudget")}
              </Button>
            ) : null}
          </div>
        }
      />

      <Tabs value={view} onValueChange={(nextValue) => setView(nextValue as BudgetView)}>
        <TabsList>
          <TabsTrigger value="ALL">{t("tabs.all")}</TabsTrigger>
          <TabsTrigger value="MONTHLY">{tCommon("periods.monthly")}</TabsTrigger>
          <TabsTrigger value="WEEKLY">{tCommon("periods.weekly")}</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <SectionCard
          title={t("progress.title")}
          description={t("progress.description")}
        >
          {filteredBudgets.length === 0 ? (
            <EmptyState
              title={t("progress.emptyTitle")}
              description={t("progress.emptyDescription")}
              action={
                canManageBudgets ? (
                  <Button type="button" onClick={() => setIsCreateOpen(true)}>
                    {t("progress.createBudget")}
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
                          <Badge variant="neutral">
                            {tCommon(`periods.${budget.period.toLowerCase()}`)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {t("progress.effectiveFrom", {
                            date: formatDateByLocale(budget.effectiveFromLocalDate, locale),
                          })}
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        {canManageBudgets ? (
                          <ActionMenu
                            label={t("budgetActions", { budget: budget.categoryName })}
                            items={[
                              {
                                label: t("actions.editBudget"),
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
                          locale={locale}
                        />
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{t("progress.spent")}</span>
                        <span>
                          {formatNumberByLocale(progress, {
                            locale,
                            maximumFractionDigits: 0,
                          })}
                          %
                        </span>
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
                          locale={locale}
                        />
                        <AmountValue
                          amountMinor={budget.limitMinor}
                          currencyCode={budget.currencyCode}
                          size="compact"
                          locale={locale}
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
          title={t("controls.title")}
          description={t("controls.description")}
        >
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>{t("controls.tipViews")}</p>
            <p>{t("controls.tipReuse")}</p>
          </div>
          {canManageBudgets ? (
            <Button
              type="button"
              disabled={expenseCategories.length === 0}
              title={
                expenseCategories.length === 0
                  ? t("requirements.expenseCategory")
                  : undefined
              }
              onClick={() => setIsCreateOpen(true)}
            >
              <PiggyBank className="size-4" aria-hidden="true" />
              {t("controls.createBudget")}
            </Button>
          ) : (
            <EmptyState
              title={t("controls.readOnlyTitle")}
              description={t("controls.readOnlyDescription")}
            />
          )}
        </SectionCard>
      </div>

      <FormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        title={t("dialogs.createTitle")}
        description={t("dialogs.createDescription")}
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
        title={
          editedBudget
            ? t("dialogs.editTitle", { category: editedBudget.categoryName })
            : t("dialogs.editFallbackTitle")
        }
        description={t("dialogs.editDescription")}
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
