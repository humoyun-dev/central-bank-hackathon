import Link from "next/link"
import { ArrowRight, Building2, Users, Wallet } from "lucide-react"
import { AmountValue } from "@/components/shared/amount-value"
import { AppLogo } from "@/components/shared/app-logo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { publicEnv } from "@/services/config/public-env"
import type { HouseholdContext } from "@/types/household"

export function HouseholdSelectionScreen({
  households,
}: {
  households: HouseholdContext[]
}) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-6">
          <AppLogo />
          <div className="space-y-3">
            <Badge variant="primary">Household-scoped entry</Badge>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground">
              Choose the workspace that should anchor routing, permissions, and
              financial context.
            </h1>
            <p className="max-w-3xl text-base leading-7 text-muted-foreground">
              Every finance object in this product belongs to a household. This
              selection screen is the first tenant boundary and should survive refresh,
              deep links, and later auth/session enforcement.
            </p>
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            {households.map((household) => (
              <Card key={household.id} className="bg-card/94">
                <CardContent className="space-y-5 pt-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-semibold tracking-tight">
                          {household.name}
                        </h2>
                        <Badge variant="primary">{household.role}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Tenant-aware dashboard with typed mock data
                      </p>
                    </div>
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Building2 className="size-5" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Available balance
                    </p>
                    <AmountValue
                      amountMinor={household.availableBalanceMinor}
                      currencyCode={household.currencyCode}
                      size="section"
                    />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="surface-muted p-4">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        Members
                      </p>
                      <p className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
                        <Users className="size-4 text-primary" aria-hidden="true" />
                        {household.memberCount} collaborators
                      </p>
                    </div>
                    <div className="surface-muted p-4">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        Month spend
                      </p>
                      <p className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
                        <Wallet className="size-4 text-primary" aria-hidden="true" />
                        {household.currencyCode} {(household.monthSpendMinor / 100).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <Button asChild className="w-full">
                    <Link href={`/${household.id}`}>
                      Open workspace
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <Card className="h-fit bg-card/94">
          <CardContent className="space-y-5 pt-6">
            <div className="space-y-2">
              <Badge>Foundation checkpoint</Badge>
              <h2 className="text-xl font-semibold tracking-tight">
                Phase 1 is wired for extension
              </h2>
              <p className="text-sm leading-6 text-muted-foreground">
                The current scaffold keeps server-first rendering, typed DTO mapping,
                query providers, and token-driven UI in place so feature work can start
                without re-laying the foundation.
              </p>
            </div>
            <ul className="space-y-3 text-sm leading-6 text-muted-foreground">
              <li>Server routes stay thin and household-aware.</li>
              <li>Browser code is prepared to call same-origin BFF endpoints.</li>
              <li>Mock mode is {publicEnv.enableMockApi ? "enabled" : "disabled"} for rapid verification.</li>
              <li>Accounts and transactions already follow DTO to domain mapping patterns.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
