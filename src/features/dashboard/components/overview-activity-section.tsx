import { getTranslations } from "next-intl/server"
import { ErrorState } from "@/components/shared/error-state"
import { SectionHeader } from "@/components/shared/section-header"
import { Button } from "@/components/ui/button"
import { getTransactions } from "@/features/transactions/api/get-transactions"
import { OverviewTransactionsPanel } from "@/features/dashboard/components/overview-transactions-panel"
import { Link } from "@/i18n/navigation"
import { getErrorPresentation } from "@/lib/error-presentation"

export async function OverviewActivitySection({
  householdId,
}: {
  householdId: string
}) {
  const t = await getTranslations("dashboard.activity")
  let transactions: Awaited<ReturnType<typeof getTransactions>> | null = null
  let copy:
    | ReturnType<typeof getErrorPresentation>
    | null = null

  try {
    transactions = await getTransactions(householdId)
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
              <Link href={`/${householdId}/transactions`}>{t("openWorkspace")}</Link>
            </Button>
          }
        />
      </section>
    )
  }

  return (
    <div className="space-y-3">
      <OverviewTransactionsPanel transactions={transactions?.slice(0, 5) ?? []} />
      <Button asChild variant="outline" className="rounded-full bg-white/70">
        <Link href={`/${householdId}/transactions`}>{t("openFullActivity")}</Link>
      </Button>
    </div>
  )
}
