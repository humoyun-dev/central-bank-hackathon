import { notFound } from "next/navigation"
import { getBudgets } from "@/features/budgets/api/get-budgets"
import { BudgetsScreen } from "@/features/budgets/components/budgets-screen"
import { getCategories } from "@/features/categories/api/get-categories"
import { getHouseholdContext } from "@/features/households/api/get-household-context"

export default async function BudgetsPage({
  params,
}: {
  params: Promise<{ householdId: string }>
}) {
  const { householdId } = await params
  const [household, budgets, categories] = await Promise.all([
    getHouseholdContext(householdId),
    getBudgets(householdId),
    getCategories(householdId),
  ])

  if (!household) {
    notFound()
  }

  return <BudgetsScreen household={household} budgets={budgets} categories={categories} />
}
