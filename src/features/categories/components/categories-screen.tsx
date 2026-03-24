import type { Category } from "@/features/categories/types/category"
import { CategoriesWorkspace } from "@/features/categories/components/categories-workspace"
import type { HouseholdContext } from "@/types/household"

export function CategoriesScreen({
  household,
  categories,
}: {
  household: HouseholdContext
  categories: Category[]
}) {
  return <CategoriesWorkspace household={household} categories={categories} />
}
