import { MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatMoney } from "@/lib/format/money"
import type { Account } from "@/features/accounts/types/account"

const accountBrandLabel: Record<Account["kind"], string> = {
  BANK: "BANK",
  CARD: "VISA",
  CASH: "CASH",
}

export function OverviewAccountGlance({
  account,
  accent = false,
}: {
  account: Account
  accent?: boolean
}) {
  return (
    <article
      className={cn(
        "rounded-[1.75rem] p-5 shadow-[0_14px_34px_rgba(17,24,39,0.08)]",
        accent ? "bg-[#b9c8ff] text-slate-950" : "bg-white text-slate-950",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-lg font-black tracking-tight">{accountBrandLabel[account.kind]}</p>
        <button type="button" className="text-slate-500" aria-label={`${account.name} menu`}>
          <MoreHorizontal className="size-4" aria-hidden="true" />
        </button>
      </div>
      <div className="mt-9 space-y-2">
        <p className="text-sm text-slate-500">{account.name}</p>
        <p className="text-financial text-3xl font-semibold tracking-tight">
          {formatMoney(account.availableBalanceMinor, account.currencyCode)}
        </p>
      </div>
      <div className="mt-8 flex items-center justify-between text-xs font-medium text-slate-500">
        <span>{account.maskedNumber ? `•• ${account.maskedNumber}` : account.kind}</span>
        <span>{account.isPrimary ? "Primary" : "01/28"}</span>
      </div>
    </article>
  )
}
