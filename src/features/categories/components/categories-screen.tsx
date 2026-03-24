import { PageHeader } from "@/components/shared/page-header"
import { SectionCard } from "@/components/shared/section-card"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/shared/empty-state"
import { CategoryForm } from "@/features/categories/components/category-form"
import type { Category } from "@/features/categories/types/category"
import type { HouseholdContext } from "@/types/household"

function CategoryListSection({
  title,
  description,
  categories,
}: {
  title: string
  description: string
  categories: Category[]
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
              <Badge variant={category.isSystem ? "neutral" : "primary"}>
                {category.kind}
              </Badge>
            </article>
          ))}
        </div>
      )}
    </SectionCard>
  )
}

export function CategoriesScreen({
  household,
  categories,
}: {
  household: HouseholdContext
  categories: Category[]
}) {
  const expenseCategories = categories.filter((category) => category.kind === "EXPENSE")
  const incomeCategories = categories.filter((category) => category.kind === "INCOME")

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Categories"
        title={`${household.name} category library`}
        description="System and household categories stay separated behind a typed boundary, so backend DTO changes never leak into the page tree."
        actions={<Badge variant="primary">{categories.length} categories</Badge>}
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="grid gap-4">
          <CategoryListSection
            title="Expense categories"
            description="Used for spending capture, budgets, and analytics grouping."
            categories={expenseCategories}
          />
          <CategoryListSection
            title="Income categories"
            description="Used for inflow classification and summary reporting."
            categories={incomeCategories}
          />
        </div>
        <SectionCard
          title="Category controls"
          description="Create household-scoped categories without mutating the system defaults."
        >
          <CategoryForm householdId={household.id} />
        </SectionCard>
      </div>
    </div>
  )
}
