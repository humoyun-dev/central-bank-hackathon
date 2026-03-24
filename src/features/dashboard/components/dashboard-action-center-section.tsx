import { getTranslations } from "next-intl/server"
import { ErrorState } from "@/components/shared/error-state"
import { getAccounts } from "@/features/accounts/api/get-accounts"
import { getBudgets } from "@/features/budgets/api/get-budgets"
import { getCategories } from "@/features/categories/api/get-categories"
import { getDebts } from "@/features/debts/api/get-debts"
import { DashboardActionCenter } from "@/features/mutations/components/dashboard-action-center"
import { getErrorPresentation } from "@/lib/error-presentation"
import type { HouseholdContext } from "@/types/household"

export async function DashboardActionCenterSection({
  household,
}: {
  household: HouseholdContext
}) {
  const t = await getTranslations("dashboard.actionCenter")
  let refs:
    | {
        accounts: Awaited<ReturnType<typeof getAccounts>>
        expenseCategories: Awaited<ReturnType<typeof getCategories>>
        incomeCategories: Awaited<ReturnType<typeof getCategories>>
        debts: Awaited<ReturnType<typeof getDebts>>
        budgets: Awaited<ReturnType<typeof getBudgets>>
      }
    | null = null
  let copy:
    | ReturnType<typeof getErrorPresentation>
    | null = null

  try {
    const [accounts, expenseCategories, incomeCategories, debts, budgets] =
      await Promise.all([
        getAccounts(household.id),
        getCategories(household.id, "EXPENSE"),
        getCategories(household.id, "INCOME"),
        getDebts(household.id),
        getBudgets(household.id),
      ])

    refs = {
      accounts,
      expenseCategories,
      incomeCategories,
      debts,
      budgets,
    }
  } catch (error) {
    copy = getErrorPresentation(error, {
      fallbackTitle: t("errorTitle"),
      fallbackDescription: t("errorDescription"),
    })
  }

  if (copy) {
    return <ErrorState title={copy.title} description={copy.description} />
  }

  return refs ? (
    <DashboardActionCenter household={household} {...refs} />
  ) : null
}
