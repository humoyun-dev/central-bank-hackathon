import { notFound } from "next/navigation"
import { getAccounts } from "@/features/accounts/api/get-accounts"
import { getDebts } from "@/features/debts/api/get-debts"
import { DebtsScreen } from "@/features/debts/components/debts-screen"
import { getHouseholdContext } from "@/features/households/api/get-household-context"

export default async function DebtsPage({
  params,
  searchParams,
}: {
  params: Promise<{ householdId: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const [{ householdId }, resolvedSearchParams] = await Promise.all([params, searchParams])
  const [household, debts, accounts] = await Promise.all([
    getHouseholdContext(householdId),
    getDebts(householdId),
    getAccounts(householdId),
  ])

  if (!household) {
    notFound()
  }

  return (
    <DebtsScreen
      household={household}
      debts={debts}
      accounts={accounts}
      initialCreateOpen={resolvedSearchParams.action === "create-debt"}
    />
  )
}
