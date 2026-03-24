import { ArrowUpRight, MinusCircle } from "lucide-react"
import { formatDateLabel } from "@/lib/format/date"
import { formatMoney } from "@/lib/format/money"
import type { TransactionListItem } from "@/features/transactions/types/transaction"

export function OverviewTransactionsPanel({
  transactions,
}: {
  transactions: TransactionListItem[]
}) {
  if (transactions.length === 0) {
    return (
      <section className="space-y-4">
        <h2 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-[2.35rem]">
          Transactions
        </h2>
        <div className="surface-card rounded-[1.5rem] bg-white/88 p-6">
          <p className="text-sm leading-6 text-slate-500">
            Recent transaction activity will appear here once the household records
            expense, income, or transfer entries.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-4">
      <h2 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-[2.35rem]">
        Transactions
      </h2>
      <div className="space-y-3">
        {transactions.map((transaction) => {
          const isExpense = transaction.kind === "EXPENSE"

          return (
            <article
              key={transaction.id}
              className="surface-card flex items-center justify-between gap-4 rounded-[1.5rem] bg-white/88 px-4 py-4"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-full bg-[#f5f4f0] text-slate-700">
                  {isExpense ? (
                    <MinusCircle className="size-4" aria-hidden="true" />
                  ) : (
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-950">
                    {transaction.description}
                  </p>
                  <p className="text-sm text-slate-500">
                    {formatDateLabel(transaction.occurredAtUtc)}
                  </p>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-financial text-sm font-semibold text-slate-950">
                  {isExpense ? "-" : "+"}
                  {formatMoney(transaction.amountMinor, transaction.currencyCode)}
                </p>
                <p className="text-xs text-slate-500">
                  {transaction.kind === "EXPENSE" ? "04:31 AM" : transaction.categoryName}
                </p>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
