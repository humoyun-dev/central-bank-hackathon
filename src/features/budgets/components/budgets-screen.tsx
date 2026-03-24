import type { Budget } from "@/features/budgets/types/budget"
import type { Category } from "@/features/categories/types/category"
import { BudgetsWorkspace } from "@/features/budgets/components/budgets-workspace"
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
  return <BudgetsWorkspace household={household} budgets={budgets} categories={categories} />
}
