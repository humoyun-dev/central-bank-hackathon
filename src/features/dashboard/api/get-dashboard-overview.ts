import "server-only"
import { getAccounts } from "@/features/accounts/api/get-accounts"
import { getHouseholdContext } from "@/features/households/api/get-household-context"
import { getTransactions } from "@/features/transactions/api/get-transactions"

export async function getDashboardOverview(householdId: string) {
  const [household, accounts, transactions] = await Promise.all([
    getHouseholdContext(householdId),
    getAccounts(householdId),
    getTransactions(householdId),
  ])

  if (!household) {
    return null
  }

  return {
    household,
    accounts,
    recentTransactions: transactions.slice(0, 4),
    totalTrackedAccounts: accounts.length,
    netCashFlowMinor: household.monthIncomeMinor - household.monthSpendMinor,
  }
}
