import { notFound } from "next/navigation"
import { getAccounts } from "@/features/accounts/api/get-accounts"
import { AccountsScreen } from "@/features/accounts/components/accounts-screen"
import { getHouseholdContext } from "@/features/households/api/get-household-context"

export default async function AccountsPage({
  params,
}: {
  params: Promise<{ householdId: string }>
}) {
  const { householdId } = await params
  const [household, accounts] = await Promise.all([
    getHouseholdContext(householdId),
    getAccounts(householdId),
  ])

  if (!household) {
    notFound()
  }

  return <AccountsScreen household={household} accounts={accounts} />
}
