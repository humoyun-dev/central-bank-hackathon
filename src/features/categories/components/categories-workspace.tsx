"use client"

import { PencilLine, Plus } from "lucide-react"
import { useTranslations } from "next-intl"
import { useMemo, useState } from "react"
import { ActionMenu } from "@/components/shared/action-menu"
import { EmptyState } from "@/components/shared/empty-state"
import { FormDialog } from "@/components/shared/forms/form-dialog"
import { PageHeader } from "@/components/shared/page-header"
import { SectionCard } from "@/components/shared/section-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CategoryForm } from "@/features/categories/components/category-form"
import type { Category, CategoryKind } from "@/features/categories/types/category"
import { hasPermission } from "@/lib/permissions"
import type { HouseholdContext } from "@/types/household"

type CategoryView = "ALL" | CategoryKind

function CategoryListSection({
  title,
  description,
  categories,
  canManageCategories,
  onEdit,
  emptyTitle,
  emptyDescription,
  systemLabel,
  customLabel,
  actionMenuLabel,
  editLabel,
  kindLabels,
}: {
  title: string
  description: string
  categories: Category[]
  canManageCategories: boolean
  onEdit: (category: Category) => void
  emptyTitle: string
  emptyDescription: string
  systemLabel: string
  customLabel: string
  actionMenuLabel: (categoryName: string) => string
  editLabel: string
  kindLabels: Record<CategoryKind, string>
}) {
  return (
    <SectionCard title={title} description={description}>
      {categories.length === 0 ? (
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
        />
      ) : (
        <div className="space-y-3">
          {categories.map((category) => (
            <article
              key={category.id}
              className="flex items-center justify-between gap-3 rounded-[1.1rem] border border-border/70 bg-card/75 px-4 py-3"
            >
              <div className="space-y-0.5">
                <p className="text-sm font-semibold text-foreground">{category.name}</p>
                <p className="text-sm text-muted-foreground">
                  {category.isSystem ? systemLabel : customLabel}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={category.isSystem ? "neutral" : "primary"}>
                  {kindLabels[category.kind]}
                </Badge>
                {!category.isSystem && canManageCategories ? (
                  <ActionMenu
                    label={actionMenuLabel(category.name)}
                    items={[
                      {
                        label: editLabel,
                        icon: <PencilLine className="size-4" aria-hidden="true" />,
                        onSelect: () => onEdit(category),
                      },
                    ]}
                  />
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}
    </SectionCard>
  )
}

export function CategoriesWorkspace({
  household,
  categories,
}: {
  household: HouseholdContext
  categories: Category[]
}) {
  const t = useTranslations("categories.workspace")
  const tCommon = useTranslations("categories.common")
  const [view, setView] = useState<CategoryView>("ALL")
  const [editedCategory, setEditedCategory] = useState<Category | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const canManageCategories = hasPermission(household.role, "manageSettings")

  const filteredCategories = useMemo(() => {
    if (view === "ALL") {
      return categories
    }

    return categories.filter((category) => category.kind === view)
  }, [categories, view])

  const expenseCategories = filteredCategories.filter(
    (category) => category.kind === "EXPENSE",
  )
  const incomeCategories = filteredCategories.filter(
    (category) => category.kind === "INCOME",
  )
  const kindLabels: Record<CategoryKind, string> = {
    EXPENSE: tCommon("kinds.expense"),
    INCOME: tCommon("kinds.income"),
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title", { household: household.name })}
        description={t("description")}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary">{t("count", { count: categories.length })}</Badge>
            {canManageCategories ? (
              <Button type="button" onClick={() => setIsCreateOpen(true)}>
                <Plus className="size-4" aria-hidden="true" />
                {t("actions.newCategory")}
              </Button>
            ) : null}
          </div>
        }
      />

      <Tabs value={view} onValueChange={(nextValue) => setView(nextValue as CategoryView)}>
        <TabsList>
          <TabsTrigger value="ALL">{t("tabs.all")}</TabsTrigger>
          <TabsTrigger value="EXPENSE">{tCommon("kinds.expense")}</TabsTrigger>
          <TabsTrigger value="INCOME">{tCommon("kinds.income")}</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="grid gap-4">
          <CategoryListSection
            title={t("sections.expense.title")}
            description={t("sections.expense.description")}
            categories={expenseCategories}
            canManageCategories={canManageCategories}
            onEdit={(category) => setEditedCategory(category)}
            emptyTitle={t("sections.emptyTitle")}
            emptyDescription={t("sections.emptyDescription")}
            systemLabel={tCommon("origin.systemDefault")}
            customLabel={tCommon("origin.householdCustom")}
            actionMenuLabel={(categoryName) => t("categoryActions", { category: categoryName })}
            editLabel={t("actions.editCategory")}
            kindLabels={kindLabels}
          />
          <CategoryListSection
            title={t("sections.income.title")}
            description={t("sections.income.description")}
            categories={incomeCategories}
            canManageCategories={canManageCategories}
            onEdit={(category) => setEditedCategory(category)}
            emptyTitle={t("sections.emptyTitle")}
            emptyDescription={t("sections.emptyDescription")}
            systemLabel={tCommon("origin.systemDefault")}
            customLabel={tCommon("origin.householdCustom")}
            actionMenuLabel={(categoryName) => t("categoryActions", { category: categoryName })}
            editLabel={t("actions.editCategory")}
            kindLabels={kindLabels}
          />
        </div>
        <SectionCard
          title={t("controls.title")}
          description={t("controls.description")}
        >
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>{t("controls.tipViews")}</p>
            <p>{t("controls.tipSystemDefaults")}</p>
          </div>
          {canManageCategories ? (
            <Button type="button" onClick={() => setIsCreateOpen(true)}>
              <Plus className="size-4" aria-hidden="true" />
              {t("controls.createCategory")}
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
        <CategoryForm
          householdId={household.id}
          onCancel={() => setIsCreateOpen(false)}
          onSuccess={() => setIsCreateOpen(false)}
        />
      </FormDialog>

      <FormDialog
        open={Boolean(editedCategory)}
        onOpenChange={(open) => !open && setEditedCategory(null)}
        title={
          editedCategory
            ? t("dialogs.editTitle", { category: editedCategory.name })
            : t("dialogs.editFallbackTitle")
        }
        description={t("dialogs.editDescription")}
      >
        {editedCategory ? (
          <CategoryForm
            householdId={household.id}
            category={editedCategory}
            onCancel={() => setEditedCategory(null)}
            onSuccess={() => setEditedCategory(null)}
          />
        ) : null}
      </FormDialog>
    </div>
  )
}
