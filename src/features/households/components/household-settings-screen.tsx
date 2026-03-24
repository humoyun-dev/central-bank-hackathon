import { getTranslations } from "next-intl/server"
import { EmptyState } from "@/components/shared/empty-state"
import { PageHeader } from "@/components/shared/page-header"
import { SectionCard } from "@/components/shared/section-card"
import { Badge } from "@/components/ui/badge"
import { hasPermission } from "@/lib/permissions"
import { formatRelativeDate } from "@/lib/format/date"
import { getCurrentLocale } from "@/i18n/server"
import { InviteMemberForm } from "@/features/households/components/invite-member-form"
import type { HouseholdContext } from "@/types/household"
import type { HouseholdInvite } from "@/features/households/types/invite"

export async function HouseholdSettingsScreen({
  household,
  invites,
}: {
  household: HouseholdContext
  invites: HouseholdInvite[]
}) {
  const t = await getTranslations("households.settings")
  const locale = await getCurrentLocale()
  const canManageSettings = hasPermission(household.role, "manageSettings")
  const roleLabels = {
    OWNER: t("roles.owner"),
    ADMIN: t("roles.admin"),
    MEMBER: t("roles.member"),
    VIEWER: t("roles.viewer"),
  } as const
  const statusLabels = {
    ACCEPTED: t("statuses.accepted"),
    PENDING: t("statuses.pending"),
  } as const

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title", { household: household.name })}
        description={t("description")}
        actions={<Badge variant="primary">{roleLabels[household.role]}</Badge>}
      />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <SectionCard
          title={t("invites.title")}
          description={t("invites.description")}
        >
          {invites.length === 0 ? (
            <EmptyState
              title={t("invites.emptyTitle")}
              description={t("invites.emptyDescription")}
            />
          ) : (
            <div className="space-y-3">
              {invites.map((invite) => (
                <article
                  key={invite.id}
                  className="rounded-[1.2rem] border border-border/70 bg-card/75 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">{invite.email}</p>
                      <p className="text-sm text-muted-foreground">
                        {invite.invitedByName} · {formatRelativeDate(invite.createdAtUtc, locale)}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge>{roleLabels[invite.role]}</Badge>
                      <Badge variant={invite.status === "ACCEPTED" ? "primary" : "neutral"}>
                        {statusLabels[invite.status]}
                      </Badge>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard
          title={t("actions.title")}
          description={t("actions.description")}
        >
          {canManageSettings ? (
            <InviteMemberForm householdId={household.id} />
          ) : (
            <EmptyState
              title={t("actions.emptyTitle")}
              description={t("actions.emptyDescription")}
            />
          )}
        </SectionCard>
      </div>
    </div>
  )
}
