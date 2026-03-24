import { ArrowRightLeft, ArrowUpRight, MinusCircle } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { SectionHeader } from "@/components/shared/section-header"
import { TransactionKindBadge } from "@/features/transactions/components/transaction-kind-badge"
import { formatDateLabel, formatTimeLabel } from "@/lib/format/date"
import { formatSignedMoney } from "@/lib/format/money"
import type { TransactionListItem } from "@/features/transactions/types/transaction"

export function OverviewTransactionsPanel({
  transactions,
}: {
  transactions: TransactionListItem[]
}) {
  const locale = useLocale()
  const t = useTranslations("dashboard.activity")
  if (transactions.length === 0) {
    return (
      <section className="space-y-4">
        <SectionHeader
          title={t("title")}
          description={t("description")}
        />
        <div className="surface-card rounded-[1.5rem] bg-white/88 p-6">
          <p className="text-sm leading-6 text-slate-500">{t("emptyDescription")}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-4">
      <SectionHeader
        title={t("title")}
        description={t("description")}
      />
      <div className="space-y-3">
        {transactions.map((transaction) => {
          const isExpense = transaction.kind === "EXPENSE"
          const isTransfer = transaction.kind === "TRANSFER"
          const Icon = isExpense
            ? MinusCircle
            : isTransfer
              ? ArrowRightLeft
              : ArrowUpRight

          return (
            <article
              key={transaction.id}
              className="surface-card flex items-center justify-between gap-4 rounded-[1.5rem] bg-white/88 px-4 py-4"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-full bg-[#f5f4f0] text-slate-700">
                  <Icon className="size-4" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-semibold text-slate-950">
                      {transaction.description}
                    </p>
                    <TransactionKindBadge kind={transaction.kind} />
                  </div>
                  <p className="text-sm text-slate-500">
                    {t("details", {
                      category: transaction.categoryName,
                      account: transaction.accountName,
                    })}
                  </p>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-financial text-sm font-semibold text-slate-950">
                  {formatSignedMoney(transaction.signedAmountMinor, transaction.currencyCode, {
                    locale,
                  })}
                </p>
                <p className="text-xs text-slate-500">
                  {formatDateLabel(transaction.occurredAtUtc, locale)} ·{" "}
                  {formatTimeLabel(transaction.occurredAtUtc, locale)}
                </p>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
