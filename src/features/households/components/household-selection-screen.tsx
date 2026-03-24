"use client"

import { ArrowRight, Building2, Users, Wallet } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { AmountValue } from "@/components/shared/amount-value"
import { AppLogo } from "@/components/shared/app-logo"
import { EmptyState } from "@/components/shared/empty-state"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AcceptInviteButton } from "@/features/households/components/accept-invite-button"
import { CreateHouseholdForm } from "@/features/households/components/create-household-form"
import { Link } from "@/i18n/navigation"
import { formatMoney } from "@/lib/format/money"
import { publicEnv } from "@/services/config/public-env"
import type { HouseholdInvite } from "@/features/households/types/invite"
import type { AuthSession } from "@/features/auth/types/session"
import type { HouseholdContext } from "@/types/household"

export function HouseholdSelectionScreen({
  households,
  pendingInvites,
  session,
}: {
  households: HouseholdContext[]
  pendingInvites: HouseholdInvite[]
  session: AuthSession
}) {
  const locale = useLocale()
  const t = useTranslations("households.selection")
  const roleLabels = {
    OWNER: t("roles.owner"),
    ADMIN: t("roles.admin"),
    MEMBER: t("roles.member"),
    VIEWER: t("roles.viewer"),
  } as const

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-6">
          <AppLogo />
          <div className="space-y-3">
            <Badge variant="primary">{t("title")}</Badge>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground">
              {t("heading")}
            </h1>
            <p className="max-w-3xl text-base leading-7 text-muted-foreground">
              {t("description")}
            </p>
          </div>
          {pendingInvites.length > 0 ? (
            <Card className="bg-card/94">
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-1">
                  <Badge variant="primary">{t("pendingInvites")}</Badge>
                  <h2 className="text-xl font-semibold tracking-tight text-foreground">
                    {t("waitingAcceptance")}
                  </h2>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {t("acceptRole")}
                  </p>
                </div>
                <div className="space-y-3">
                  {pendingInvites.map((invite) => (
                    <article
                      key={invite.id}
                      className="flex flex-col gap-3 rounded-[1.2rem] border border-border/70 bg-muted/45 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-foreground">
                          {invite.householdName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {t("invitedBy", {
                            role: roleLabels[invite.role],
                            name: invite.invitedByName,
                          })}
                        </p>
                      </div>
                      <AcceptInviteButton inviteId={invite.id} />
                    </article>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : null}
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
                        <Badge variant="primary">{roleLabels[household.role]}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {t("tenantAware")}
                      </p>
                    </div>
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Building2 className="size-5" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      {t("availableBalance")}
                    </p>
                    <AmountValue
                      amountMinor={household.availableBalanceMinor}
                      currencyCode={household.currencyCode}
                      size="section"
                      locale={locale}
                    />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="surface-muted p-4">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        {t("members")}
                      </p>
                      <p className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
                        <Users className="size-4 text-primary" aria-hidden="true" />
                        {t("collaborators", { count: household.memberCount })}
                      </p>
                    </div>
                    <div className="surface-muted p-4">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        {t("monthSpend")}
                      </p>
                      <p className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
                        <Wallet className="size-4 text-primary" aria-hidden="true" />
                        {formatMoney(household.monthSpendMinor, household.currencyCode, {
                          currencyDisplay: "code",
                          locale,
                        })}
                      </p>
                    </div>
                  </div>
                  <Button asChild className="w-full">
                    <Link href={`/${household.id}`}>
                      {t("openWorkspace")}
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
              <Badge>{t("activeSession")}</Badge>
              <h2 className="text-xl font-semibold tracking-tight">
                {session.user.fullName}
              </h2>
              <p className="text-sm leading-6 text-muted-foreground">
                {session.user.email}
              </p>
            </div>
            <ul className="space-y-3 text-sm leading-6 text-muted-foreground">
              <li>{t("serverRoutes")}</li>
              <li>{t("cookieSession")}</li>
              <li>{t("mockMode", { status: publicEnv.enableMockApi ? t("enabled") : t("disabled") })}</li>
              <li>{t("workspacesAttached", { count: session.memberships.length })}</li>
            </ul>
            <CreateHouseholdForm />
            {households.length === 0 ? (
              <EmptyState
                title={t("noHouseholds")}
                description={t("noHouseholdsDesc")}
              />
            ) : null}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
