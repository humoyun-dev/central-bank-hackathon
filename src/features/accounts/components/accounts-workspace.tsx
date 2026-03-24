"use client"

import { ArrowRightLeft, Eye, PencilLine, Plus } from "lucide-react"
import { useTranslations } from "next-intl"
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
import { Link } from "@/i18n/navigation"
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
  locale,
  initialCreateOpen = false,
}: {
  household: HouseholdContext
  accounts: Account[]
  locale: string
  initialCreateOpen?: boolean
}) {
  const t = useTranslations("accounts.workspace")
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
        eyebrow={t("eyebrow")}
        title={t("title", { household: household.name })}
        description={t("description")}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary">{t("totalAccounts", { count: accounts.length })}</Badge>
            {canManageAccounts ? (
              <Button type="button" onClick={() => setDialogState({ type: "create" })}>
                <Plus className="size-4" aria-hidden="true" />
                {t("newAccount")}
              </Button>
            ) : null}
            <Button asChild variant="outline" className="rounded-full bg-white/70">
              <Link href={`/${household.id}/transactions`}>
                {t("reviewActivity")}
                <ArrowRightLeft className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        }
      />
      <Tabs value={view} onValueChange={(nextValue) => setView(nextValue as AccountView)}>
        <TabsList>
          <TabsTrigger value="ALL">{t("tabs.all")}</TabsTrigger>
          <TabsTrigger value="ACTIVE">{t("tabs.active")}</TabsTrigger>
          <TabsTrigger value="RESTRICTED">{t("tabs.restricted")}</TabsTrigger>
          <TabsTrigger value="ARCHIVED">{t("tabs.archived")}</TabsTrigger>
        </TabsList>
      </Tabs>

      {accounts.length === 0 ? (
        <EmptyState
          title={t("emptyTitle")}
          description={t("emptyDescription")}
          action={
            canManageAccounts ? (
              <Button type="button" onClick={() => setDialogState({ type: "create" })}>
                {t("createAccount")}
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
                locale={locale}
                action={
                  <ActionMenu
                    label={t("accountActions", { account: account.name })}
                    items={[
                      {
                        label: t("viewDetails"),
                        icon: <Eye className="size-4" aria-hidden="true" />,
                        onSelect: () => setDialogState({ type: "detail", accountId: account.id }),
                      },
                      ...(canManageAccounts
                        ? [
                            {
                              label: t("editAccount"),
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
                  title={t("filteredEmptyTitle")}
                  description={t("filteredEmptyDescription")}
                />
              </div>
            ) : null}
          </div>
          <SectionCard
            title={t("portfolio.title")}
            description={t("portfolio.description")}
          >
            <div className="grid gap-3">
              <div className="surface-muted rounded-[1.1rem] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {t("portfolio.primaryAccount")}
                </p>
                <p className="mt-2 text-base font-semibold text-foreground">
                  {primaryAccount?.name ?? t("portfolio.notAssigned")}
                </p>
              </div>
              <div className="surface-muted rounded-[1.1rem] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {t("portfolio.mix")}
                </p>
                <div className="mt-2 space-y-2 text-sm text-muted-foreground">
                  <p>{t("portfolio.bankAccounts", { count: bankAccounts })}</p>
                  <p>{t("portfolio.cardAccounts", { count: cardAccounts })}</p>
                  <p>{t("portfolio.cashAccounts", { count: cashAccounts })}</p>
                </div>
              </div>
              <div className="surface-muted rounded-[1.1rem] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {t("portfolio.actionModel")}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {t("portfolio.actionDescription")}
                </p>
              </div>
              {canManageAccounts ? (
                <Button type="button" onClick={() => setDialogState({ type: "create" })}>
                  <Plus className="size-4" aria-hidden="true" />
                  {t("addAccount")}
                </Button>
              ) : null}
            </div>
          </SectionCard>
        </div>
      )}

      <FormDialog
        open={dialogState?.type === "create"}
        onOpenChange={(open) => !open && setDialogState(null)}
        title={t("dialogs.createTitle")}
        description={t("dialogs.createDescription")}
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
        title={
          selectedAccount
            ? t("dialogs.editTitle", { account: selectedAccount.name })
            : t("dialogs.editFallbackTitle")
        }
        description={t("dialogs.editDescription")}
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
        title={selectedAccount ? selectedAccount.name : t("dialogs.detailsFallbackTitle")}
        description={t("dialogs.detailsDescription")}
      >
        {selectedAccount ? <AccountDetails account={selectedAccount} locale={locale} /> : null}
      </FormDialog>
    </div>
  )
}
