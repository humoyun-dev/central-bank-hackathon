import Link from "next/link"
import { EmptyState } from "@/components/shared/empty-state"
import { ErrorState } from "@/components/shared/error-state"
import { SectionHeader } from "@/components/shared/section-header"
import { Button } from "@/components/ui/button"
import { getAccounts } from "@/features/accounts/api/get-accounts"
import { OverviewAccountGlance } from "@/features/dashboard/components/overview-account-glance"
import { getErrorPresentation } from "@/lib/error-presentation"

export async function OverviewWalletSection({
  householdId,
}: {
  householdId: string
}) {
  let accounts: Awaited<ReturnType<typeof getAccounts>> | null = null
  let copy:
    | ReturnType<typeof getErrorPresentation>
    | null = null

  try {
    accounts = await getAccounts(householdId)
  } catch (error) {
    copy = getErrorPresentation(error, {
      fallbackTitle: "Wallet preview unavailable",
      fallbackDescription:
        "The account preview could not be loaded for this household right now.",
    })
  }

  if (copy) {
    return (
      <section className="space-y-4">
        <SectionHeader
          title="Wallet"
          description="Compact account cards shaped for scanability and fast action."
        />
        <ErrorState
          title={copy.title}
          description={copy.description}
          action={
            <Button asChild variant="outline" className="rounded-full bg-white/70">
              <Link href={`/${householdId}/accounts`}>Open accounts</Link>
            </Button>
          }
        />
      </section>
    )
  }

  return (
    <section className="space-y-4">
      <SectionHeader
        title="Wallet"
        description="Compact account cards shaped for scanability and fast action."
        action={
          <Button asChild variant="outline" className="rounded-full bg-white/70">
            <Link href={`/${householdId}/accounts`}>View all</Link>
          </Button>
        }
      />
      {accounts && accounts.length === 0 ? (
        <EmptyState
          title="No accounts connected"
          description="Connected household accounts will appear here after the first account is created or synced."
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
