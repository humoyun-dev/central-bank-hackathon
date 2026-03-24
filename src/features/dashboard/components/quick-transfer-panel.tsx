import Link from "next/link"
import {
  ArrowRightLeft,
  Building2,
  CreditCard,
  Lock,
  Plus,
  WalletCards,
} from "lucide-react"
import { AmountValue } from "@/components/shared/amount-value"
import { EmptyState } from "@/components/shared/empty-state"
import { ErrorState } from "@/components/shared/error-state"
import { SectionHeader } from "@/components/shared/section-header"
import { Button } from "@/components/ui/button"
import { getAccounts } from "@/features/accounts/api/get-accounts"
import { getErrorPresentation } from "@/lib/error-presentation"
import { getVisibleDashboardActions } from "@/lib/permissions"
import type { HouseholdContext } from "@/types/household"

const accountIconMap = {
  BANK: Building2,
  CARD: CreditCard,
  CASH: WalletCards,
} as const

export async function QuickTransferPanel({
  household,
}: {
  household: HouseholdContext
}) {
  const visibility = getVisibleDashboardActions(household.role)
  let transferTargets: Awaited<ReturnType<typeof getAccounts>> | null = null
  let copy:
    | ReturnType<typeof getErrorPresentation>
    | null = null

  try {
    const accounts = await getAccounts(household.id)
    transferTargets = accounts.filter((account) => account.status !== "ARCHIVED").slice(0, 4)
  } catch (error) {
    copy = getErrorPresentation(error, {
      fallbackTitle: "Transfer shortcuts unavailable",
      fallbackDescription:
        "The overview could not load active transfer surfaces for this household right now.",
    })
  }

  if (copy) {
    return (
      <section className="space-y-4">
        <SectionHeader title="Quick transfer" />
        <ErrorState
          title={copy.title}
          description={copy.description}
          action={
            <Button asChild variant="outline" className="rounded-full bg-white/70">
              <Link href={`/${household.id}/accounts`}>Open accounts</Link>
            </Button>
          }
        />
      </section>
    )
  }

  return (
    <section className="space-y-4">
      <SectionHeader
        title="Quick transfer"
        description="Start from a live account surface without leaving the overview."
        action={
          <Button asChild variant="outline" className="rounded-full bg-white/70">
            <Link href={`/${household.id}/transactions`}>Open movement workspace</Link>
          </Button>
        }
      />
      {!visibility.canInitiateTransfer ? (
        <EmptyState
          title="Transfer actions are limited for this role"
          description="This membership can review balances and activity, but initiating household money movement requires a higher permission scope."
          icon={Lock}
          action={
            <Button asChild variant="outline" className="rounded-full bg-white/70">
              <Link href={`/${household.id}/accounts`}>Review account surfaces</Link>
            </Button>
          }
        />
      ) : transferTargets && transferTargets.length === 0 ? (
        <EmptyState
          title="No active transfer surfaces"
          description="Create or reconnect at least one active household account to unlock transfer shortcuts and destination suggestions."
          action={
            <Button asChild variant="outline" className="rounded-full bg-white/70">
              <Link href={`/${household.id}/accounts`}>Review accounts</Link>
            </Button>
          }
        />
      ) : (
        <div className="surface-card rounded-[1.75rem] bg-white/78 p-4">
          <div className="flex gap-3 overflow-x-auto pb-1">
            <Button
              asChild
              variant="default"
              className="h-auto shrink-0 rounded-[1.4rem] px-4 py-4"
            >
              <Link
                href={`/${household.id}/transactions?action=transfer&kind=TRANSFER`}
                className="flex min-w-[11rem] items-center gap-3"
              >
                <span className="flex size-11 items-center justify-center rounded-full bg-white text-slate-950">
                  <Plus className="size-5" aria-hidden="true" />
                </span>
                <span className="space-y-1 text-left">
                  <span className="block text-sm font-semibold">New transfer</span>
                  <span className="block text-xs font-normal text-white/80">
                    Start a household movement
                  </span>
                </span>
              </Link>
            </Button>
            {transferTargets?.map((account) => {
              const Icon = accountIconMap[account.kind]

              return (
                <Link
                  key={account.id}
                  href={`/${household.id}/transactions?query=${encodeURIComponent(account.name)}`}
                  className="surface-muted min-w-[12rem] shrink-0 rounded-[1.4rem] p-4 transition-colors hover:bg-white"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex size-11 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm">
                      <Icon className="size-5" aria-hidden="true" />
                    </div>
                    <ArrowRightLeft className="mt-1 size-4 text-slate-400" aria-hidden="true" />
                  </div>
                  <div className="mt-4 space-y-1">
                    <p className="truncate text-sm font-semibold text-slate-950">
                      {account.name}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {account.institutionName}
                    </p>
                  </div>
                  <div className="mt-4">
                    <AmountValue
                      amountMinor={account.availableBalanceMinor}
                      currencyCode={account.currencyCode}
                      size="compact"
                      className="text-slate-950"
                    />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}
