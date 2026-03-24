import { useTranslations } from "next-intl"
import { AmountValue } from "@/components/shared/amount-value"
import { StatusBadge } from "@/components/shared/status-badge"
import type { Account } from "@/features/accounts/types/account"
import { formatDateLabel } from "@/lib/format/date"
import { formatMoney } from "@/lib/format/money"

const toneByStatus = {
  ACTIVE: "success",
  RESTRICTED: "warning",
  ARCHIVED: "neutral",
} as const

export function AccountDetails({
  account,
  locale,
}: {
  account: Account
  locale?: string | undefined
}) {
  const t = useTranslations("accounts.details")
  const tCommon = useTranslations("accounts.common")
  const statusLabels = {
    ACTIVE: tCommon("status.active"),
    RESTRICTED: tCommon("status.restricted"),
    ARCHIVED: tCommon("status.archived"),
  } as const
  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-[1.2rem] border border-border/70 bg-card/75 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {t("available")}
          </p>
          <div className="mt-2">
            <AmountValue
              amountMinor={account.availableBalanceMinor}
              currencyCode={account.currencyCode}
              size="section"
              locale={locale}
            />
          </div>
        </div>
        <div className="rounded-[1.2rem] border border-border/70 bg-card/75 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {t("ledger")}
          </p>
          <p className="mt-2 text-financial text-lg font-semibold text-foreground">
            {formatMoney(account.balanceMinor, account.currencyCode, {
              currencyDisplay: "code",
              locale,
            })}
          </p>
        </div>
      </div>
      <dl className="grid gap-3 rounded-[1.2rem] border border-border/70 bg-card/75 p-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {t("institution")}
          </dt>
          <dd className="mt-1 text-foreground">{account.institutionName}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {t("status")}
          </dt>
          <dd className="mt-1">
            <StatusBadge label={statusLabels[account.status]} tone={toneByStatus[account.status]} />
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {t("lastFour")}
          </dt>
          <dd className="mt-1 text-foreground">{account.maskedNumber ?? t("notSet")}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {t("primary")}
          </dt>
          <dd className="mt-1 text-foreground">{account.isPrimary ? t("yes") : t("no")}</dd>
        </div>
        {account.archivedAtUtc ? (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {t("archived")}
            </dt>
            <dd className="mt-1 text-foreground">{formatDateLabel(account.archivedAtUtc, locale)}</dd>
          </div>
        ) : null}
        {account.disabledReason ? (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {t("availabilityNote")}
            </dt>
            <dd className="mt-1 text-foreground">{account.disabledReason}</dd>
          </div>
        ) : null}
      </dl>
    </div>
  )
}
