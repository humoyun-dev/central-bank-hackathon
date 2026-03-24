"use client"

import { ArrowRightLeft, Eye, PencilLine, Plus } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"
import { ActionMenu } from "@/components/shared/action-menu"
import { EmptyState } from "@/components/shared/empty-state"
import { FormDialog } from "@/components/shared/forms/form-dialog"
import { PageHeader } from "@/components/shared/page-header"
import { SectionCard } from "@/components/shared/section-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AccountCard } from "@/features/accounts/components/account-card"
import { AccountDetails } from "@/features/accounts/components/account-details"
import { AccountForm } from "@/features/accounts/components/account-form"
import type { Account } from "@/features/accounts/types/account"
import { hasPermission } from "@/lib/permissions"
import type { HouseholdContext } from "@/types/household"

type AccountView = "ALL" | "ACTIVE" | "RESTRICTED" | "ARCHIVED"
type DialogState =
  | { type: "create" }
  | { type: "detail"; accountId: string }
  | { type: "edit"; accountId: string }
  | null

export function AccountsWorkspace({
  household,
  accounts,
  initialCreateOpen = false,
}: {
  household: HouseholdContext
  accounts: Account[]
  initialCreateOpen?: boolean
}) {
  const [view, setView] = useState<AccountView>("ALL")
  const canManageAccounts = hasPermission(household.role, "manageSettings")
  const [dialogState, setDialogState] = useState<DialogState>(() =>
    initialCreateOpen && canManageAccounts ? { type: "create" } : null,
  )

  const filteredAccounts = useMemo(() => {
    if (view === "ALL") {
      return accounts
    }

    return accounts.filter((account) => account.status === view)
  }, [accounts, view])

  const primaryAccount = accounts.find((account) => account.isPrimary) ?? null
  const bankAccounts = accounts.filter((account) => account.kind === "BANK").length
  const cardAccounts = accounts.filter((account) => account.kind === "CARD").length
  const cashAccounts = accounts.filter((account) => account.kind === "CASH").length
  const selectedAccount =
    dialogState && dialogState.type !== "create"
      ? accounts.find((account) => account.id === dialogState.accountId) ?? null
      : null

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Household accounts"
        title={`${household.name} account surfaces`}
        description="Manage bank, card, and cash surfaces through focused dialogs while the workspace stays server-owned by default."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary">{accounts.length} total accounts</Badge>
            {canManageAccounts ? (
              <Button type="button" onClick={() => setDialogState({ type: "create" })}>
                <Plus className="size-4" aria-hidden="true" />
                New account
              </Button>
            ) : null}
            <Button asChild variant="outline" className="rounded-full bg-white/70">
              <Link href={`/${household.id}/transactions`}>
                Review activity
                <ArrowRightLeft className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        }
      />
      <Tabs value={view} onValueChange={(nextValue) => setView(nextValue as AccountView)}>
        <TabsList>
          <TabsTrigger value="ALL">All</TabsTrigger>
          <TabsTrigger value="ACTIVE">Active</TabsTrigger>
          <TabsTrigger value="RESTRICTED">Restricted</TabsTrigger>
          <TabsTrigger value="ARCHIVED">Archived</TabsTrigger>
        </TabsList>
      </Tabs>

      {accounts.length === 0 ? (
        <EmptyState
          title="No accounts connected yet"
          description="Create the first household account to unlock balance, transfer, and budgeting workflows."
          action={
            canManageAccounts ? (
              <Button type="button" onClick={() => setDialogState({ type: "create" })}>
                Create account
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_18.5rem]">
          <div className="grid gap-4 md:grid-cols-2">
            {filteredAccounts.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                action={
                  <ActionMenu
                    label={`${account.name} actions`}
                    items={[
                      {
                        label: "View details",
                        icon: <Eye className="size-4" aria-hidden="true" />,
                        onSelect: () => setDialogState({ type: "detail", accountId: account.id }),
                      },
                      ...(canManageAccounts
                        ? [
                            {
                              label: "Edit account",
                              icon: <PencilLine className="size-4" aria-hidden="true" />,
                              onSelect: () =>
                                setDialogState({ type: "edit", accountId: account.id }),
                            },
                          ]
                        : []),
                    ]}
                  />
                }
              />
            ))}
            {filteredAccounts.length === 0 ? (
              <div className="md:col-span-2">
                <EmptyState
                  title="No accounts in this view"
                  description="Switch tabs or create another account to populate this slice."
                />
              </div>
            ) : null}
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
                  Action model
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Create, detail, and edit flows live in dialogs so the workspace keeps a clean, card-driven scan path.
                </p>
              </div>
              {canManageAccounts ? (
                <Button type="button" onClick={() => setDialogState({ type: "create" })}>
                  <Plus className="size-4" aria-hidden="true" />
                  Add account
                </Button>
              ) : null}
            </div>
          </SectionCard>
        </div>
      )}

      <FormDialog
        open={dialogState?.type === "create"}
        onOpenChange={(open) => !open && setDialogState(null)}
        title="Create account"
        description="Add a new bank, card, or cash surface for this household."
      >
        <AccountForm
          householdId={household.id}
          currencyCode={household.currencyCode}
          onCancel={() => setDialogState(null)}
          onSuccess={() => setDialogState(null)}
        />
      </FormDialog>

      <FormDialog
        open={dialogState?.type === "edit" && Boolean(selectedAccount)}
        onOpenChange={(open) => !open && setDialogState(null)}
        title={selectedAccount ? `Edit ${selectedAccount.name}` : "Edit account"}
        description="Update account labels, availability state, and primary placement."
      >
        {selectedAccount ? (
          <AccountForm
            householdId={household.id}
            currencyCode={household.currencyCode}
            account={selectedAccount}
            onCancel={() => setDialogState(null)}
            onSuccess={() => setDialogState(null)}
          />
        ) : null}
      </FormDialog>

      <FormDialog
        open={dialogState?.type === "detail" && Boolean(selectedAccount)}
        onOpenChange={(open) => !open && setDialogState(null)}
        title={selectedAccount ? selectedAccount.name : "Account details"}
        description="Review the current balance posture and availability state for this account."
      >
        {selectedAccount ? <AccountDetails account={selectedAccount} /> : null}
      </FormDialog>
    </div>
  )
}
