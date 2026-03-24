import type { Account } from "@/features/accounts/types/account"
import type { Debt } from "@/features/debts/types/debt"
import { DebtsWorkspace } from "@/features/debts/components/debts-workspace"
import type { HouseholdContext } from "@/types/household"

export function DebtsScreen({
  household,
  debts,
  accounts,
  initialCreateOpen = false,
}: {
  household: HouseholdContext
  debts: Debt[]
  accounts: Account[]
  initialCreateOpen?: boolean
}) {
  return (
    <DebtsWorkspace
      household={household}
      debts={debts}
      accounts={accounts}
      initialCreateOpen={initialCreateOpen}
    />
  )
}
