import Link from "next/link"
import { ArrowRightLeft } from "lucide-react"
import { EmptyState } from "@/components/shared/empty-state"
import { PageHeader } from "@/components/shared/page-header"
import { SectionCard } from "@/components/shared/section-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Account } from "@/features/accounts/types/account"
import type { HouseholdContext } from "@/types/household"
import { AccountCard } from "@/features/accounts/components/account-card"

export function AccountsScreen({
  household,
  accounts,
}: {
  household: HouseholdContext
  accounts: Account[]
}) {
  const primaryAccount = accounts.find((account) => account.isPrimary) ?? null
  const bankAccounts = accounts.filter((account) => account.kind === "BANK").length
  const cardAccounts = accounts.filter((account) => account.kind === "CARD").length
  const cashAccounts = accounts.filter((account) => account.kind === "CASH").length

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Household accounts"
        title={`${household.name} account surfaces`}
        description="Accounts stay server-rendered by default, while future create/edit flows can attach client forms and mutations without changing the page architecture."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary">{accounts.length} live accounts</Badge>
            <Button asChild variant="outline" className="rounded-full bg-white/70">
              <Link href={`/${household.id}/transactions`}>
                Review activity
                <ArrowRightLeft className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        }
      />
      {accounts.length === 0 ? (
        <EmptyState
          title="No accounts connected yet"
          description="Account surfaces will appear here once a household has at least one connected bank, card, or cash wallet. This state is ready for an onboarding CTA in the next phase."
        />
      ) : (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_18.5rem]">
          <div className="grid gap-4 md:grid-cols-2">
            {accounts.map((account) => (
              <AccountCard key={account.id} account={account} />
            ))}
          </div>
          <SectionCard
            title="Portfolio posture"
            description="A compact summary that can evolve into health, sync, and permission diagnostics."
          >
            <div className="grid gap-3">
              <div className="surface-muted rounded-[1.1rem] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Primary account
                </p>
                <p className="mt-2 text-base font-semibold text-foreground">
                  {primaryAccount?.name ?? "Not assigned"}
                </p>
              </div>
              <div className="surface-muted rounded-[1.1rem] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Mix
                </p>
                <div className="mt-2 space-y-2 text-sm text-muted-foreground">
                  <p>{bankAccounts} bank accounts</p>
                  <p>{cardAccounts} card accounts</p>
                  <p>{cashAccounts} cash reserves</p>
                </div>
              </div>
              <div className="surface-muted rounded-[1.1rem] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Next foundation step
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Add create/edit account dialogs on a client island while preserving the
                  same server-owned page shell.
                </p>
              </div>
              <Button asChild variant="outline" className="rounded-full bg-white/75">
                <Link href={`/${household.id}`}>Return to overview</Link>
              </Button>
            </div>
          </SectionCard>
        </div>
      )}
    </div>
  )
}
