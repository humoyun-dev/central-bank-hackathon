import Link from "next/link"
import { ErrorState } from "@/components/shared/error-state"
import { SectionHeader } from "@/components/shared/section-header"
import { Button } from "@/components/ui/button"
import { getTransactions } from "@/features/transactions/api/get-transactions"
import { OverviewTransactionsPanel } from "@/features/dashboard/components/overview-transactions-panel"
import { getErrorPresentation } from "@/lib/error-presentation"

export async function OverviewActivitySection({
  householdId,
}: {
  householdId: string
}) {
  let transactions: Awaited<ReturnType<typeof getTransactions>> | null = null
  let copy:
    | ReturnType<typeof getErrorPresentation>
    | null = null

  try {
    transactions = await getTransactions(householdId)
  } catch (error) {
    copy = getErrorPresentation(error, {
      fallbackTitle: "Recent activity unavailable",
      fallbackDescription:
        "The latest household transactions could not be assembled right now.",
    })
  }

  if (copy) {
    return (
      <section className="space-y-4">
        <SectionHeader title="Transactions" />
        <ErrorState
          title={copy.title}
          description={copy.description}
          action={
            <Button asChild variant="outline" className="rounded-full bg-white/70">
              <Link href={`/${householdId}/transactions`}>Open activity workspace</Link>
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
        <Link href={`/${householdId}/transactions`}>Open full activity</Link>
      </Button>
    </div>
  )
}
