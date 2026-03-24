"use client"

import { PencilLine, Plus } from "lucide-react"
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
}: {
  title: string
  description: string
  categories: Category[]
  canManageCategories: boolean
  onEdit: (category: Category) => void
}) {
  return (
    <SectionCard title={title} description={description}>
      {categories.length === 0 ? (
        <EmptyState
          title="No categories"
          description="This category group has not been configured yet."
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
                  {category.isSystem ? "System default" : "Household custom"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={category.isSystem ? "neutral" : "primary"}>
                  {category.kind}
                </Badge>
                {!category.isSystem && canManageCategories ? (
                  <ActionMenu
                    label={`${category.name} actions`}
                    items={[
                      {
                        label: "Edit category",
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

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Categories"
        title={`${household.name} category library`}
        description="Create and edit household categories through focused dialogs while system defaults remain protected."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary">{categories.length} categories</Badge>
            {canManageCategories ? (
              <Button type="button" onClick={() => setIsCreateOpen(true)}>
                <Plus className="size-4" aria-hidden="true" />
                New category
              </Button>
            ) : null}
          </div>
        }
      />

      <Tabs value={view} onValueChange={(nextValue) => setView(nextValue as CategoryView)}>
        <TabsList>
          <TabsTrigger value="ALL">All</TabsTrigger>
          <TabsTrigger value="EXPENSE">Expense</TabsTrigger>
          <TabsTrigger value="INCOME">Income</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="grid gap-4">
          <CategoryListSection
            title="Expense categories"
            description="Used for spending capture, budgets, and analytics grouping."
            categories={expenseCategories}
            canManageCategories={canManageCategories}
            onEdit={(category) => setEditedCategory(category)}
          />
          <CategoryListSection
            title="Income categories"
            description="Used for inflow classification and summary reporting."
            categories={incomeCategories}
            canManageCategories={canManageCategories}
            onEdit={(category) => setEditedCategory(category)}
          />
        </div>
        <SectionCard
          title="Category controls"
          description="Dialogs keep category mutations out of the reading path and preserve a calm workspace."
        >
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>Expense and income libraries can be filtered through the tab controls above.</p>
            <p>System defaults stay read-only; only household custom categories expose edit actions.</p>
          </div>
          {canManageCategories ? (
            <Button type="button" onClick={() => setIsCreateOpen(true)}>
              <Plus className="size-4" aria-hidden="true" />
              Create category
            </Button>
          ) : (
            <EmptyState
              title="Category actions are limited"
              description="This membership can review category mappings, but it cannot mutate them."
            />
          )}
        </SectionCard>
      </div>

      <FormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        title="Create category"
        description="Add a household-scoped category without modifying system defaults."
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
        title={editedCategory ? `Edit ${editedCategory.name}` : "Edit category"}
        description="Rename a household custom category while keeping its kind stable."
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
