import type { Account } from "@/features/accounts/types/account"
import type { Category } from "@/features/categories/types/category"
import type {
  TransactionFilters,
  TransactionListItem,
} from "@/features/transactions/types/transaction"
import type { HouseholdContext } from "@/types/household"
import { TransactionsWorkspace } from "@/features/transactions/components/transactions-workspace"

export function TransactionsScreen({
  household,
  filters,
  transactions,
  accounts,
  expenseCategories,
  incomeCategories,
  initialAction,
}: {
  household: HouseholdContext
  filters: TransactionFilters
  transactions: TransactionListItem[]
  accounts: Account[]
  expenseCategories: Category[]
  incomeCategories: Category[]
  initialAction?: "expense" | "income" | "transfer" | undefined
}) {
  return (
    <TransactionsWorkspace
      household={household}
      filters={filters}
      transactions={transactions}
      accounts={accounts}
      expenseCategories={expenseCategories}
      incomeCategories={incomeCategories}
      initialAction={initialAction}
    />
  )
}
