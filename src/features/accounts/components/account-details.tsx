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

export function AccountDetails({ account }: { account: Account }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-[1.2rem] border border-border/70 bg-card/75 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Available
          </p>
          <div className="mt-2">
            <AmountValue
              amountMinor={account.availableBalanceMinor}
              currencyCode={account.currencyCode}
              size="section"
            />
          </div>
        </div>
        <div className="rounded-[1.2rem] border border-border/70 bg-card/75 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Ledger
          </p>
          <p className="mt-2 text-financial text-lg font-semibold text-foreground">
            {formatMoney(account.balanceMinor, account.currencyCode, {
              currencyDisplay: "code",
            })}
          </p>
        </div>
      </div>
      <dl className="grid gap-3 rounded-[1.2rem] border border-border/70 bg-card/75 p-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Institution
          </dt>
          <dd className="mt-1 text-foreground">{account.institutionName}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Status
          </dt>
          <dd className="mt-1">
            <StatusBadge label={account.status} tone={toneByStatus[account.status]} />
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Last four
          </dt>
          <dd className="mt-1 text-foreground">{account.maskedNumber ?? "Not set"}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Primary
          </dt>
          <dd className="mt-1 text-foreground">{account.isPrimary ? "Yes" : "No"}</dd>
        </div>
        {account.archivedAtUtc ? (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Archived
            </dt>
            <dd className="mt-1 text-foreground">{formatDateLabel(account.archivedAtUtc)}</dd>
          </div>
        ) : null}
        {account.disabledReason ? (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Availability note
            </dt>
            <dd className="mt-1 text-foreground">{account.disabledReason}</dd>
          </div>
        ) : null}
      </dl>
    </div>
  )
}
