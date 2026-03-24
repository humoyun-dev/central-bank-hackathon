"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useLocale, useTranslations } from "next-intl"
import { Controller, useForm, useWatch } from "react-hook-form"
import { useEffect, useState } from "react"
import { FormActions } from "@/components/shared/forms/form-actions"
import { AmountField } from "@/components/shared/forms/amount-field"
import { DateField } from "@/components/shared/forms/date-field"
import { AccountSelect } from "@/components/shared/forms/account-select"
import { FormSection } from "@/components/shared/forms/form-section"
import { InlineFormError } from "@/components/shared/forms/inline-form-error"
import { FormFieldError } from "@/components/shared/forms/form-field-error"
import { DebtStatusBadge } from "@/features/debts/components/debt-status-badge"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { settleDebt } from "@/features/debts/api/settle-debt"
import type { Debt } from "@/features/debts/types/debt"
import {
  settleDebtFormSchema,
  type SettleDebtFormValues,
} from "@/features/debts/schemas/settle-debt"
import type { Account } from "@/features/accounts/types/account"
import { applyProblemDetailsToForm } from "@/features/mutations/lib/form-errors"
import { useHouseholdMutation } from "@/features/mutations/hooks/use-household-mutation"
import { formatDateTimeInputValue, parseDateTimeInputToUtc } from "@/lib/format/date"
import { formatMoneyByLocale, parseMoneyToMinor } from "@/lib/format/money"
import { queryKeys } from "@/lib/query-keys"

function getDefaultValues(
  debts: Debt[],
  accounts: Account[],
  occurredAtLocal = "",
): SettleDebtFormValues {
  return {
    debtId: debts[0]?.id ?? "",
    accountId: accounts[0]?.id ?? "",
    amount: "",
    note: "",
    occurredAtLocal,
  }
}

export function DebtSettlementForm({
  householdId,
  debts,
  accounts,
  initialDebtId,
  onCancel,
  onSuccess,
}: {
  householdId: string
  debts: Debt[]
  accounts: Account[]
  initialDebtId?: string | undefined
  onCancel?: (() => void) | undefined
  onSuccess?: (() => void) | undefined
}) {
  const locale = useLocale()
  const t = useTranslations("debts.settlementForm")
  const [formError, setFormError] = useState("")
  const form = useForm<SettleDebtFormValues>({
    resolver: zodResolver(settleDebtFormSchema),
    defaultValues: {
      ...getDefaultValues(debts, accounts),
      ...(initialDebtId ? { debtId: initialDebtId } : null),
    },
  })

  useEffect(() => {
    if (initialDebtId) {
      form.setValue("debtId", initialDebtId)
    }
  }, [form, initialDebtId])

  useEffect(() => {
    if (!form.getValues("occurredAtLocal")) {
      form.setValue("occurredAtLocal", formatDateTimeInputValue(new Date()))
    }
  }, [form])

  const selectedDebtId = useWatch({
    control: form.control,
    name: "debtId",
  })
  const selectedDebt = debts.find((debt) => debt.id === selectedDebtId) ?? null

  const mutation = useHouseholdMutation({
    mutationFn: async (
      { debtId, ...payload }: Parameters<typeof settleDebt>[2] & { debtId: string },
      idempotencyKey,
    ) => settleDebt(householdId, debtId, payload, idempotencyKey),
    invalidateKeys: [queryKeys.household(householdId)],
    successMessage: "debts.toasts.settled",
    idempotencyScope: "debt-settlement",
    onSuccess: () => {
      form.reset(
        getDefaultValues(debts, accounts, formatDateTimeInputValue(new Date())),
      )
      setFormError("")
      onSuccess?.()
    },
  })

  const handleSubmit = form.handleSubmit(async (values) => {
    setFormError("")

    if (selectedDebt) {
      const amountMinor = parseMoneyToMinor(values.amount)

      if (amountMinor > selectedDebt.remainingAmountMinor) {
        form.setError("amount", {
          type: "manual",
          message: "validation.debts.amount.exceedsRemaining",
        })
        return
      }
    }

    try {
      await mutation.mutateAsync({
        debtId: values.debtId,
        accountId: values.accountId,
        amountMinor: parseMoneyToMinor(values.amount),
        note: values.note?.trim() ? values.note.trim() : null,
        occurredAtUtc: parseDateTimeInputToUtc(values.occurredAtLocal),
      })
    } catch (error) {
      setFormError(applyProblemDetailsToForm(error, form.setError))
    }
  })

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <InlineFormError message={formError} />
      <FormSection
        title={t("sections.target.title")}
        description={t("sections.target.description")}
      >
        <Controller
          control={form.control}
          name="debtId"
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <Label htmlFor="settlement-debt">{t("fields.debt.label")}</Label>
              <Select value={field.value} onValueChange={field.onChange} disabled={mutation.isPending}>
                <SelectTrigger id="settlement-debt" aria-invalid={fieldState.invalid}>
                  <SelectValue placeholder={t("fields.debt.placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  {debts.map((debt) => (
                    <SelectItem key={debt.id} value={debt.id}>
                      {t("fields.debt.option", {
                        name: debt.counterpartyName,
                        amount: formatMoneyByLocale(debt.remainingAmountMinor, debt.currencyCode, {
                          locale,
                        }),
                      })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormFieldError message={fieldState.error?.message} />
            </div>
          )}
        />
        {selectedDebt ? (
          <div className="rounded-[1rem] border border-border/60 bg-background px-4 py-3 text-sm">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium text-foreground">{selectedDebt.counterpartyName}</p>
              <DebtStatusBadge status={selectedDebt.status} />
            </div>
            <p className="mt-2 text-muted-foreground">
              {t("selectedDebt.remaining", {
                amount: formatMoneyByLocale(
                  selectedDebt.remainingAmountMinor,
                  selectedDebt.currencyCode,
                  { locale },
                ),
              })}
            </p>
          </div>
        ) : null}
        <AccountSelect
          accounts={accounts}
          control={form.control}
          name="accountId"
          label={t("fields.account.label")}
          disabled={mutation.isPending}
        />
      </FormSection>
      <FormSection
        title={t("sections.details.title")}
        description={t("sections.details.description")}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <AmountField
            control={form.control}
            name="amount"
            disabled={mutation.isPending}
          />
          <DateField
            control={form.control}
            name="occurredAtLocal"
            label={t("fields.occurredAt.label")}
            disabled={mutation.isPending}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="settlement-note">{t("fields.note.label")}</Label>
          <Textarea
            id="settlement-note"
            placeholder={t("fields.note.placeholder")}
            disabled={mutation.isPending}
            {...form.register("note")}
          />
          <FormFieldError message={form.formState.errors.note?.message} />
        </div>
      </FormSection>
      <FormActions
        isSubmitting={mutation.isPending}
        onCancel={onCancel}
        submitLabel={t("actions.submit")}
        pendingLabel={t("actions.pending")}
      />
    </form>
  )
}
