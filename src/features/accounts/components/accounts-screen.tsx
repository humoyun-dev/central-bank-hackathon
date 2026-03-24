import type { Account } from "@/features/accounts/types/account"
import { AccountsWorkspace } from "@/features/accounts/components/accounts-workspace"
import type { HouseholdContext } from "@/types/household"

export function AccountsScreen({
  household,
  accounts,
  locale,
  initialCreateOpen = false,
}: {
  household: HouseholdContext
  accounts: Account[]
  locale: string
  initialCreateOpen?: boolean
}) {
  return (
    <AccountsWorkspace
      household={household}
      accounts={accounts}
      locale={locale}
      initialCreateOpen={initialCreateOpen}
    />
  )
}
