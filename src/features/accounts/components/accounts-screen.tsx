import type { Account } from "@/features/accounts/types/account"
import { AccountsWorkspace } from "@/features/accounts/components/accounts-workspace"
import type { HouseholdContext } from "@/types/household"

export function AccountsScreen({
  household,
  accounts,
  initialCreateOpen = false,
}: {
  household: HouseholdContext
  accounts: Account[]
  initialCreateOpen?: boolean
}) {
  return (
    <AccountsWorkspace
      household={household}
      accounts={accounts}
      initialCreateOpen={initialCreateOpen}
    />
  )
}
