import {
  ArrowRightLeft,
  Building2,
  CreditCard,
  Lock,
  Plus,
  WalletCards,
} from "lucide-react"
import { getTranslations } from "next-intl/server"
import { AmountValue } from "@/components/shared/amount-value"
import { EmptyState } from "@/components/shared/empty-state"
import { ErrorState } from "@/components/shared/error-state"
import { SectionHeader } from "@/components/shared/section-header"
import { Button } from "@/components/ui/button"
import { getAccounts } from "@/features/accounts/api/get-accounts"
import { Link } from "@/i18n/navigation"
import { getCurrentLocale } from "@/i18n/server"
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
  const locale = await getCurrentLocale()
  const t = await getTranslations("dashboard.quickTransfer")
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
      fallbackTitle: t("errorTitle"),
      fallbackDescription: t("errorDescription"),
    })
  }

  if (copy) {
    return (
      <section className="space-y-4">
        <SectionHeader title={t("title")} />
        <ErrorState
          title={copy.title}
          description={copy.description}
          action={
            <Button asChild variant="outline" className="rounded-full bg-white/70">
              <Link href={`/${household.id}/accounts`}>{t("openAccounts")}</Link>
            </Button>
          }
        />
      </section>
    )
  }

  return (
    <section className="space-y-4">
      <SectionHeader
        title={t("title")}
        description={t("description")}
        action={
          <Button asChild variant="outline" className="rounded-full bg-white/70">
            <Link href={`/${household.id}/transactions`}>{t("openWorkspace")}</Link>
          </Button>
        }
      />
      {!visibility.canInitiateTransfer ? (
        <EmptyState
          title={t("readOnlyTitle")}
          description={t("readOnlyDescription")}
          icon={Lock}
          action={
            <Button asChild variant="outline" className="rounded-full bg-white/70">
              <Link href={`/${household.id}/accounts`}>{t("reviewAccounts")}</Link>
            </Button>
          }
        />
      ) : transferTargets && transferTargets.length === 0 ? (
        <EmptyState
          title={t("emptyTitle")}
          description={t("emptyDescription")}
          action={
            <Button asChild variant="outline" className="rounded-full bg-white/70">
              <Link href={`/${household.id}/accounts`}>{t("reviewAccounts")}</Link>
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
                  <span className="block text-sm font-semibold">{t("newTransferTitle")}</span>
                  <span className="block text-xs font-normal text-white/80">
                    {t("newTransferDescription")}
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
                      locale={locale}
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
