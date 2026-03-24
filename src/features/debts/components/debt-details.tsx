import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import { AmountValue } from "@/components/shared/amount-value"
import { DebtStatusBadge } from "@/features/debts/components/debt-status-badge"
import type { Debt } from "@/features/debts/types/debt"
import { formatDateLabel } from "@/lib/format/date"

export function DebtDetails({
  debt,
  locale,
}: {
  debt: Debt
  locale?: string | undefined
}) {
  const t = useTranslations("debts.details")
  const tCommon = useTranslations("debts.common")

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-[1.2rem] border border-border/70 bg-card/75 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {t("remaining")}
          </p>
          <div className="mt-2">
            <AmountValue
              amountMinor={
                debt.direction === "PAYABLE"
                  ? -debt.remainingAmountMinor
                  : debt.remainingAmountMinor
              }
              currencyCode={debt.currencyCode}
              size="section"
              locale={locale}
            />
          </div>
        </div>
        <div className="rounded-[1.2rem] border border-border/70 bg-card/75 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {t("original")}
          </p>
          <div className="mt-2">
            <AmountValue
              amountMinor={
                debt.direction === "PAYABLE"
                  ? -debt.originalAmountMinor
                  : debt.originalAmountMinor
              }
              currencyCode={debt.currencyCode}
              size="section"
              locale={locale}
            />
          </div>
        </div>
      </div>
      <dl className="grid gap-3 rounded-[1.2rem] border border-border/70 bg-card/75 p-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {t("counterparty")}
          </dt>
          <dd className="mt-1 text-foreground">{debt.counterpartyName}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {t("direction")}
          </dt>
          <dd className="mt-1">
            <Badge variant={debt.direction === "PAYABLE" ? "warning" : "primary"}>
              {tCommon(`direction.${debt.direction.toLowerCase()}`)}
            </Badge>
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {t("status")}
          </dt>
          <dd className="mt-1">
            <DebtStatusBadge status={debt.status} />
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {t("created")}
          </dt>
          <dd className="mt-1 text-foreground">{formatDateLabel(debt.createdAtUtc, locale)}</dd>
        </div>
        {debt.dueAtUtc ? (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {t("due")}
            </dt>
            <dd className="mt-1 text-foreground">{formatDateLabel(debt.dueAtUtc, locale)}</dd>
          </div>
        ) : null}
        {debt.description ? (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {t("description")}
            </dt>
            <dd className="mt-1 text-foreground">{debt.description}</dd>
          </div>
        ) : null}
      </dl>
    </div>
  )
}
