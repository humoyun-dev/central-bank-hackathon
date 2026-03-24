import Link from "next/link"
import { getDashboardOverview } from "@/features/dashboard/api/get-dashboard-overview"
import { BalanceHero } from "@/features/dashboard/components/balance-hero"
import { OverviewAccountGlance } from "@/features/dashboard/components/overview-account-glance"
import { OverviewTransactionsPanel } from "@/features/dashboard/components/overview-transactions-panel"
import { QuickTransferPanel } from "@/features/dashboard/components/quick-transfer-panel"
import { StatisticsPanel } from "@/features/dashboard/components/statistics-panel"
import { Button } from "@/components/ui/button"

type DashboardOverview = NonNullable<Awaited<ReturnType<typeof getDashboardOverview>>>

export function DashboardOverviewScreen({
  overview,
}: {
  overview: DashboardOverview
}) {
  const { household, accounts, recentTransactions, totalTrackedAccounts, netCashFlowMinor } =
    overview

  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)]">
        <div className="space-y-5">
          <BalanceHero
            household={household}
            accountCount={totalTrackedAccounts}
            netCashFlowMinor={netCashFlowMinor}
          />
          <QuickTransferPanel />
          <OverviewTransactionsPanel transactions={recentTransactions} />
        </div>
        <div className="space-y-5">
          <section className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1">
                <h2 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-[2.35rem]">
                  Wallet
                </h2>
                <p className="text-sm leading-6 text-slate-500">
                  Compact account cards shaped for scanability and fast action.
                </p>
              </div>
              <Button asChild variant="outline" className="rounded-full bg-white/70">
                <Link href={`/${household.id}/accounts`}>View all</Link>
              </Button>
            </div>
            {accounts.length === 0 ? (
              <div className="surface-card rounded-[1.75rem] bg-white/88 p-6">
                <p className="text-sm leading-6 text-slate-500">
                  Connected household accounts will appear here after the first account
                  is created or synced.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {accounts.slice(0, 4).map((account, index) => (
                  <OverviewAccountGlance
                    key={account.id}
                    account={account}
                    accent={index === 1}
                  />
                ))}
              </div>
            )}
          </section>
          <StatisticsPanel household={household} />
        </div>
      </div>
    </div>
  )
}
