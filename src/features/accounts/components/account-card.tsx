import type { ReactNode } from "react"
import { Building2, CreditCard, WalletCards } from "lucide-react"
import { useTranslations } from "next-intl"
import { AmountValue } from "@/components/shared/amount-value"
import { StatusBadge } from "@/components/shared/status-badge"
import { Card, CardContent } from "@/components/ui/card"
import type { Account } from "@/features/accounts/types/account"
import { cn } from "@/lib/utils"
import { formatDateLabel } from "@/lib/format/date"
import { formatMoney } from "@/lib/format/money"

const accountStatusTone = {
  ACTIVE: "success",
  RESTRICTED: "warning",
  ARCHIVED: "neutral",
} as const

export function AccountCard({
  account,
  compact = false,
  locale,
  action,
}: {
  account: Account
  compact?: boolean
  locale?: string | undefined
  action?: ReactNode
}) {
  const t = useTranslations("accounts.common")
  const accountMeta = {
    BANK: {
      label: t("kinds.bank"),
      icon: Building2,
    },
    CARD: {
      label: t("kinds.card"),
      icon: CreditCard,
    },
    CASH: {
      label: t("kinds.cash"),
      icon: WalletCards,
    },
  } as const
  const statusLabels = {
    ACTIVE: t("status.active"),
    RESTRICTED: t("status.restricted"),
    ARCHIVED: t("status.archived"),
  } as const
  const meta = accountMeta[account.kind]
  const Icon = meta.icon
  const isArchived = account.status === "ARCHIVED"
  const isRestricted = account.status === "RESTRICTED"

  return (
    <Card
      className={cn(
        "bg-card/94",
        compact ? "rounded-[1.5rem]" : "rounded-[1.75rem]",
        isArchived ? "opacity-75" : "",
      )}
    >
      <CardContent className={cn("space-y-4", compact ? "px-5 pb-5 pt-5" : "px-5 pb-5 pt-5")}>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold">{account.name}</h3>
              <StatusBadge label={meta.label} />
              {account.isPrimary ? <StatusBadge label={t("primary")} tone="primary" /> : null}
              <StatusBadge label={statusLabels[account.status]} tone={accountStatusTone[account.status]} />
            </div>
            <p className="text-sm text-muted-foreground">
              {account.institutionName}
              {account.maskedNumber
                ? t("maskedNumber", { maskedNumber: account.maskedNumber })
                : ""}
            </p>
          </div>
          <div className="flex items-start gap-2">
            {action}
            <div className="flex size-10 items-center justify-center rounded-[1.1rem] bg-primary/10 text-primary">
              <Icon className="size-5" aria-hidden="true" />
            </div>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {t("available")}
          </p>
          <AmountValue
            amountMinor={account.availableBalanceMinor}
            currencyCode={account.currencyCode}
            size={compact ? "compact" : "section"}
            locale={locale}
          />
        </div>
        {!compact ? (
          <>
            <div className="surface-muted flex items-center justify-between rounded-[1rem] px-4 py-3 text-sm">
              <span className="text-muted-foreground">{t("ledgerBalance")}</span>
              <span className="text-financial font-medium text-foreground">
                {formatMoney(account.balanceMinor, account.currencyCode, {
                  currencyDisplay: "code",
                  locale,
                })}
              </span>
            </div>
            {isRestricted || isArchived ? (
              <div className="surface-muted rounded-[1rem] px-4 py-3 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">
                  {isArchived ? t("archivedAccount") : t("restrictedAccount")}
                </p>
                <p className="mt-1 leading-6">
                  {account.disabledReason ??
                    (isArchived && account.archivedAtUtc
                      ? t("archivedOn", {
                          date: formatDateLabel(account.archivedAtUtc, locale),
                        })
                      : t("limitedAvailability"))}
                </p>
              </div>
            ) : null}
          </>
        ) : null}
      </CardContent>
    </Card>
  )
}
