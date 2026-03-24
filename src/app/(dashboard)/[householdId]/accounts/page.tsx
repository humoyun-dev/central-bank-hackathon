import { notFound } from "next/navigation"
import { getAccounts } from "@/features/accounts/api/get-accounts"
import { AccountsScreen } from "@/features/accounts/components/accounts-screen"
import { getHouseholdContext } from "@/features/households/api/get-household-context"

export default async function AccountsPage({
  params,
  searchParams,
}: {
  params: Promise<{ householdId: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const [{ householdId }, resolvedSearchParams] = await Promise.all([params, searchParams])
  const [household, accounts] = await Promise.all([
    getHouseholdContext(householdId),
    getAccounts(householdId),
  ])

  if (!household) {
    notFound()
  }

  const shouldOpenCreate = resolvedSearchParams.action === "create-account"

  return (
    <AccountsScreen
      household={household}
      accounts={accounts}
      initialCreateOpen={shouldOpenCreate}
    />
  )
}
