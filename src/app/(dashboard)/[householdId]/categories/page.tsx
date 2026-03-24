import { notFound } from "next/navigation"
import { getCategories } from "@/features/categories/api/get-categories"
import { CategoriesScreen } from "@/features/categories/components/categories-screen"
import { getHouseholdContext } from "@/features/households/api/get-household-context"

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ householdId: string }>
}) {
  const { householdId } = await params
  const [household, categories] = await Promise.all([
    getHouseholdContext(householdId),
    getCategories(householdId),
  ])

  if (!household) {
    notFound()
  }

  return <CategoriesScreen household={household} categories={categories} />
}
