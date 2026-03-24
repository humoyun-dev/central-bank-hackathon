import { getTranslations } from "next-intl/server"
import { EmptyState } from "@/components/shared/empty-state"
import { ErrorState } from "@/components/shared/error-state"
import { SectionHeader } from "@/components/shared/section-header"
import { Button } from "@/components/ui/button"
import { getAccounts } from "@/features/accounts/api/get-accounts"
import { OverviewAccountGlance } from "@/features/dashboard/components/overview-account-glance"
import { Link } from "@/i18n/navigation"
import { getErrorPresentation } from "@/lib/error-presentation"

export async function OverviewWalletSection({
  householdId,
}: {
  householdId: string
}) {
  const t = await getTranslations("dashboard.wallet")
  let accounts: Awaited<ReturnType<typeof getAccounts>> | null = null
  let copy:
    | ReturnType<typeof getErrorPresentation>
    | null = null

  try {
    accounts = await getAccounts(householdId)
  } catch (error) {
    copy = getErrorPresentation(error, {
      fallbackTitle: t("errorTitle"),
      fallbackDescription: t("errorDescription"),
    })
  }

  if (copy) {
    return (
      <section className="space-y-4">
        <SectionHeader
          title={t("title")}
          description={t("description")}
        />
        <ErrorState
          title={copy.title}
          description={copy.description}
          action={
            <Button asChild variant="outline" className="rounded-full bg-white/70">
              <Link href={`/${householdId}/accounts`}>{t("openAccounts")}</Link>
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
            <Link href={`/${householdId}/accounts`}>{t("viewAll")}</Link>
          </Button>
        }
      />
      {accounts && accounts.length === 0 ? (
        <EmptyState
          title={t("emptyTitle")}
          description={t("emptyDescription")}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {accounts?.slice(0, 4).map((account, index) => (
            <OverviewAccountGlance
              key={account.id}
              account={account}
              accent={index === 1}
            />
          ))}
        </div>
      )}
    </section>
  )
}
