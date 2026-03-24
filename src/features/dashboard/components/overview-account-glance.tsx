import { MoreHorizontal } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { StatusBadge } from "@/components/shared/status-badge"
import { cn } from "@/lib/utils"
import { formatMoney } from "@/lib/format/money"
import type { Account } from "@/features/accounts/types/account"

const accountStatusTone = {
  ACTIVE: "success",
  RESTRICTED: "warning",
  ARCHIVED: "neutral",
} as const

export function OverviewAccountGlance({
  account,
  accent = false,
}: {
  account: Account
  accent?: boolean
}) {
  const locale = useLocale()
  const t = useTranslations("accounts.common")
  const accountBrandLabel: Record<Account["kind"], string> = {
    BANK: t("kinds.bank"),
    CARD: t("kinds.card"),
    CASH: t("kinds.cash"),
  }
  const accountStatusLabel: Record<Account["status"], string> = {
    ACTIVE: t("status.active"),
    RESTRICTED: t("status.restricted"),
    ARCHIVED: t("status.archived"),
  }

  return (
    <article
      className={cn(
        "rounded-[1.75rem] p-5 shadow-[0_14px_34px_rgba(17,24,39,0.08)]",
        accent ? "bg-[#b9c8ff] text-slate-950" : "bg-white text-slate-950",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-lg font-black tracking-tight">{accountBrandLabel[account.kind]}</p>
        <button
          type="button"
          className="text-slate-500"
          aria-label={t("menu", { account: account.name })}
        >
          <MoreHorizontal className="size-4" aria-hidden="true" />
        </button>
      </div>
      <div className="mt-9 space-y-2">
        <p className="text-sm text-slate-500">{account.name}</p>
        <p className="text-financial text-3xl font-semibold tracking-tight">
          {formatMoney(account.availableBalanceMinor, account.currencyCode, { locale })}
        </p>
      </div>
      <div className="mt-8 flex items-center justify-between gap-3 text-xs font-medium text-slate-500">
        <span className="truncate">
          {account.maskedNumber
            ? t("institutionWithMask", {
                institution: account.institutionName,
                maskedNumber: account.maskedNumber,
              })
            : account.institutionName}
        </span>
        <div className="flex items-center gap-2">
          {account.isPrimary ? <StatusBadge label={t("primary")} tone="primary" /> : null}
          <StatusBadge
            label={accountStatusLabel[account.status]}
            tone={accountStatusTone[account.status]}
          />
        </div>
      </div>
    </article>
  )
}
