import { notFound } from "next/navigation"
import { getAccounts } from "@/features/accounts/api/get-accounts"
import { getDebts } from "@/features/debts/api/get-debts"
import { DebtsScreen } from "@/features/debts/components/debts-screen"
import { getHouseholdContext } from "@/features/households/api/get-household-context"

export default async function DebtsPage({
  params,
}: {
  params: Promise<{ householdId: string }>
}) {
  const { householdId } = await params
  const [household, debts, accounts] = await Promise.all([
    getHouseholdContext(householdId),
    getDebts(householdId),
    getAccounts(householdId),
  ])

  if (!household) {
    notFound()
  }

  return <DebtsScreen household={household} debts={debts} accounts={accounts} />
}
