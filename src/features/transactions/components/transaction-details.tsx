import { useTranslations } from "next-intl"
import type { TransactionListItem } from "@/features/transactions/types/transaction"
import { TransactionKindBadge } from "@/features/transactions/components/transaction-kind-badge"
import { StatusBadge } from "@/components/shared/status-badge"
import { formatDateLabel, formatRelativeDate } from "@/lib/format/date"
import { formatSignedMoney } from "@/lib/format/money"

export function TransactionDetails({
  transaction,
  locale,
}: {
  transaction: TransactionListItem
  locale?: string | undefined
}) {
  const t = useTranslations("transactions.details")
  const tStatus = useTranslations("transactions.status")

  return (
    <div className="space-y-4">
      <div className="rounded-[1.2rem] border border-border/70 bg-card/75 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {t("amount")}
        </p>
        <p className="mt-2 text-financial text-2xl font-semibold text-foreground">
          {formatSignedMoney(transaction.signedAmountMinor, transaction.currencyCode, {
            locale,
          })}
        </p>
      </div>
      <dl className="grid gap-3 rounded-[1.2rem] border border-border/70 bg-card/75 p-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {t("description")}
          </dt>
          <dd className="mt-1 text-foreground">{transaction.description}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {t("kind")}
          </dt>
          <dd className="mt-1">
            <TransactionKindBadge kind={transaction.kind} />
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {t("category")}
          </dt>
          <dd className="mt-1 text-foreground">{transaction.categoryName}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {t("account")}
          </dt>
          <dd className="mt-1 text-foreground">{transaction.accountName}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {t("postedAt")}
          </dt>
          <dd className="mt-1 text-foreground">
            {formatDateLabel(transaction.occurredAtUtc, locale)} ·{" "}
            {formatRelativeDate(transaction.occurredAtUtc, locale)}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {t("status")}
          </dt>
          <dd className="mt-1">
            <StatusBadge
              label={tStatus(transaction.status.toLowerCase())}
              tone={transaction.status === "POSTED" ? "success" : "warning"}
            />
          </dd>
        </div>
      </dl>
    </div>
  )
}
