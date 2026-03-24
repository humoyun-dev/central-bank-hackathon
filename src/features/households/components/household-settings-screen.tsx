import { EmptyState } from "@/components/shared/empty-state"
import { PageHeader } from "@/components/shared/page-header"
import { SectionCard } from "@/components/shared/section-card"
import { Badge } from "@/components/ui/badge"
import { hasPermission } from "@/lib/permissions"
import { formatRelativeDate } from "@/lib/format/date"
import { InviteMemberForm } from "@/features/households/components/invite-member-form"
import type { HouseholdContext } from "@/types/household"
import type { HouseholdInvite } from "@/features/households/types/invite"

export function HouseholdSettingsScreen({
  household,
  invites,
}: {
  household: HouseholdContext
  invites: HouseholdInvite[]
}) {
  const canManageSettings = hasPermission(household.role, "manageSettings")

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Household settings"
        title={`${household.name} membership controls`}
        description="Access and invite management stay household-scoped, role-aware, and server-rendered by default."
        actions={<Badge variant="primary">{household.role}</Badge>}
      />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <SectionCard
          title="Pending and accepted invites"
          description="Invites are normalized into typed UI models so future backend fields can be added without touching the page shell."
        >
          {invites.length === 0 ? (
            <EmptyState
              title="No invites yet"
              description="This household has not issued any role-scoped member invites."
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
                        {invite.invitedByName} · {formatRelativeDate(invite.createdAtUtc)}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge>{invite.role}</Badge>
                      <Badge variant={invite.status === "ACCEPTED" ? "primary" : "neutral"}>
                        {invite.status}
                      </Badge>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Role-aware actions"
          description="Only owner and admin memberships can issue new invites."
        >
          {canManageSettings ? (
            <InviteMemberForm householdId={household.id} />
          ) : (
            <EmptyState
              title="Read-only membership"
              description="Invite management is disabled for the current role."
            />
          )}
        </SectionCard>
      </div>
    </div>
  )
}
