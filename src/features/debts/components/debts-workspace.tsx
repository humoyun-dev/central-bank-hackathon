"use client"

import { Eye, HandCoins, Landmark, Plus } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useMemo, useState } from "react"
import { ActionMenu } from "@/components/shared/action-menu"
import { AmountValue } from "@/components/shared/amount-value"
import { EmptyState } from "@/components/shared/empty-state"
import { FormDialog } from "@/components/shared/forms/form-dialog"
import { PageHeader } from "@/components/shared/page-header"
import { SectionCard } from "@/components/shared/section-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Account } from "@/features/accounts/types/account"
import { DebtDetails } from "@/features/debts/components/debt-details"
import { DebtForm } from "@/features/debts/components/debt-form"
import { DebtSettlementForm } from "@/features/debts/components/debt-settlement-form"
import { DebtStatusBadge } from "@/features/debts/components/debt-status-badge"
import type { Debt, DebtStatus } from "@/features/debts/types/debt"
import { formatDateLabel } from "@/lib/format/date"
import { hasPermission } from "@/lib/permissions"
import type { HouseholdContext } from "@/types/household"

type DebtView = "ALL" | DebtStatus

export function DebtsWorkspace({
  household,
  debts,
  accounts,
  initialCreateOpen = false,
}: {
  household: HouseholdContext
  debts: Debt[]
  accounts: Account[]
  initialCreateOpen?: boolean
}) {
  const locale = useLocale()
  const t = useTranslations("debts.workspace")
  const tCommon = useTranslations("debts.common")
  const [view, setView] = useState<DebtView>("ALL")
  const openDebts = debts.filter((debt) => debt.status !== "SETTLED")
  const filteredDebts = useMemo(() => {
    if (view === "ALL") {
      return debts
    }

    return debts.filter((debt) => debt.status === view)
  }, [debts, view])
  const canCreateDebt = hasPermission(household.role, "createDebt")
  const canSettleDebt = hasPermission(household.role, "settleDebt")
  const activeAccounts = accounts.filter((account) => account.status === "ACTIVE")
  const [isCreateOpen, setIsCreateOpen] = useState(
    () => initialCreateOpen && canCreateDebt,
  )
  const [settlementDebtId, setSettlementDebtId] = useState<string | null>(null)
  const [detailDebtId, setDetailDebtId] = useState<string | null>(null)
  const detailDebt = debts.find((debt) => debt.id === detailDebtId) ?? null

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title", { household: household.name })}
        description={t("description")}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary">{t("openItems", { count: openDebts.length })}</Badge>
            {canCreateDebt ? (
              <Button type="button" onClick={() => setIsCreateOpen(true)}>
                <Plus className="size-4" aria-hidden="true" />
                {t("actions.addDebt")}
              </Button>
            ) : null}
            {canSettleDebt ? (
              <Button
                type="button"
                variant="outline"
                disabled={openDebts.length === 0 || activeAccounts.length === 0}
                title={
                  openDebts.length === 0
                    ? t("requirements.createDebtBeforeSettlement")
                    : activeAccounts.length === 0
                      ? t("requirements.createActiveAccount")
                      : undefined
                }
                onClick={() => setSettlementDebtId(openDebts[0]?.id ?? null)}
              >
                <HandCoins className="size-4" aria-hidden="true" />
                {t("actions.settleDebt")}
              </Button>
            ) : null}
          </div>
        }
      />

      <Tabs value={view} onValueChange={(nextValue) => setView(nextValue as DebtView)}>
        <TabsList>
          <TabsTrigger value="ALL">{t("tabs.all")}</TabsTrigger>
          <TabsTrigger value="OPEN">{t("tabs.open")}</TabsTrigger>
          <TabsTrigger value="PARTIAL">{t("tabs.partial")}</TabsTrigger>
          <TabsTrigger value="SETTLED">{t("tabs.settled")}</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <SectionCard
          title={t("ledger.title")}
          description={t("ledger.description")}
        >
          {filteredDebts.length === 0 ? (
            <EmptyState
              title={t("ledger.emptyTitle")}
              description={t("ledger.emptyDescription")}
              action={
                canCreateDebt ? (
                  <Button type="button" onClick={() => setIsCreateOpen(true)}>
                    {t("ledger.createDebt")}
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <div className="space-y-3">
              {filteredDebts.map((debt) => (
                <article
                  key={debt.id}
                  className="rounded-[1.2rem] border border-border/70 bg-card/75 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-base font-semibold text-foreground">
                          {debt.counterpartyName}
                        </h2>
                        <DebtStatusBadge status={debt.status} />
                        <Badge variant={debt.direction === "PAYABLE" ? "warning" : "primary"}>
                          {tCommon(`direction.${debt.direction.toLowerCase()}`)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {t("meta.created", {
                          date: formatDateLabel(debt.createdAtUtc, locale),
                        })}
                        {debt.dueAtUtc
                          ? ` · ${t("meta.due", {
                              date: formatDateLabel(debt.dueAtUtc, locale),
                            })}`
                          : ""}
                      </p>
                      {debt.description ? (
                        <p className="text-sm leading-6 text-muted-foreground">
                          {debt.description}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex items-start gap-2">
                      <ActionMenu
                        label={t("debtActions", { debt: debt.counterpartyName })}
                        items={[
                          {
                            label: t("actions.viewDetails"),
                            icon: <Eye className="size-4" aria-hidden="true" />,
                            onSelect: () => setDetailDebtId(debt.id),
                          },
                          ...(canSettleDebt && debt.status !== "SETTLED"
                            ? [
                                {
                                  label: t("actions.settleDebt"),
                                  icon: <HandCoins className="size-4" aria-hidden="true" />,
                                  onSelect: () => setSettlementDebtId(debt.id),
                                },
                              ]
                            : []),
                        ]}
                      />
                      <AmountValue
                        amountMinor={
                          debt.direction === "PAYABLE"
                            ? -debt.remainingAmountMinor
                            : debt.remainingAmountMinor
                        }
                        currencyCode={debt.currencyCode}
                        size="compact"
                        locale={locale}
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard
          title={t("actionsPanel.title")}
          description={t("actionsPanel.description")}
        >
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>{t("actionsPanel.tipViews")}</p>
            <p>{t("actionsPanel.tipSettlement")}</p>
          </div>
          {canCreateDebt ? (
            <Button type="button" onClick={() => setIsCreateOpen(true)}>
              <Landmark className="size-4" aria-hidden="true" />
              {t("actionsPanel.createDebt")}
            </Button>
          ) : (
            <EmptyState
              title={t("actionsPanel.readOnlyTitle")}
              description={t("actionsPanel.readOnlyDescription")}
            />
          )}
        </SectionCard>
      </div>

      <FormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        title={t("dialogs.createTitle")}
        description={t("dialogs.createDescription")}
      >
        <DebtForm
          householdId={household.id}
          onCancel={() => setIsCreateOpen(false)}
          onSuccess={() => setIsCreateOpen(false)}
        />
      </FormDialog>

      <FormDialog
        open={Boolean(settlementDebtId)}
        onOpenChange={(open) => !open && setSettlementDebtId(null)}
        title={t("dialogs.settleTitle")}
        description={t("dialogs.settleDescription")}
      >
        {settlementDebtId ? (
          <DebtSettlementForm
            householdId={household.id}
            debts={openDebts}
            accounts={activeAccounts}
            initialDebtId={settlementDebtId}
            onCancel={() => setSettlementDebtId(null)}
            onSuccess={() => setSettlementDebtId(null)}
          />
        ) : null}
      </FormDialog>

      <FormDialog
        open={Boolean(detailDebt)}
        onOpenChange={(open) => !open && setDetailDebtId(null)}
        title={detailDebt ? detailDebt.counterpartyName : t("dialogs.detailsFallbackTitle")}
        description={t("dialogs.detailsDescription")}
      >
        {detailDebt ? <DebtDetails debt={detailDebt} locale={locale} /> : null}
      </FormDialog>
    </div>
  )
}
