"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm, useWatch } from "react-hook-form"
import { useState } from "react"
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
import { parseMoneyToMinor } from "@/lib/format/money"
import { queryKeys } from "@/lib/query-keys"

function getDefaultValues(debts: Debt[], accounts: Account[]): SettleDebtFormValues {
  return {
    debtId: debts[0]?.id ?? "",
    accountId: accounts[0]?.id ?? "",
    amount: "",
    note: "",
    occurredAtLocal: formatDateTimeInputValue(new Date()),
  }
}

export function DebtSettlementForm({
  householdId,
  debts,
  accounts,
  onCancel,
  onSuccess,
}: {
  householdId: string
  debts: Debt[]
  accounts: Account[]
  onCancel?: (() => void) | undefined
  onSuccess?: (() => void) | undefined
}) {
  const [formError, setFormError] = useState("")
  const form = useForm<SettleDebtFormValues>({
    resolver: zodResolver(settleDebtFormSchema),
    defaultValues: getDefaultValues(debts, accounts),
  })

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
    successMessage: "Debt settlement recorded",
    idempotencyScope: "debt-settlement",
    onSuccess: () => {
      form.reset(getDefaultValues(debts, accounts))
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
          message: "Settlement amount cannot exceed the remaining balance.",
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
        title="Settlement target"
        description="Choose an open or partially settled debt and record the movement through a live account."
      >
        <Controller
          control={form.control}
          name="debtId"
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <Label htmlFor="settlement-debt">Debt record</Label>
              <Select value={field.value} onValueChange={field.onChange} disabled={mutation.isPending}>
                <SelectTrigger id="settlement-debt" aria-invalid={fieldState.invalid}>
                  <SelectValue placeholder="Choose a debt to settle" />
                </SelectTrigger>
                <SelectContent>
                  {debts.map((debt) => (
                    <SelectItem key={debt.id} value={debt.id}>
                      {debt.counterpartyName} · {(debt.remainingAmountMinor / 100).toFixed(2)} {debt.currencyCode}
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
              Remaining: {(selectedDebt.remainingAmountMinor / 100).toFixed(2)} {selectedDebt.currencyCode}
            </p>
          </div>
        ) : null}
        <AccountSelect
          accounts={accounts}
          control={form.control}
          name="accountId"
          label="Settlement account"
          disabled={mutation.isPending}
        />
      </FormSection>
      <FormSection
        title="Settlement details"
        description="Partial settlements are supported. Full settlement is detected automatically when the remaining amount reaches zero."
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
            label="Occurred at"
            disabled={mutation.isPending}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="settlement-note">Note</Label>
          <Textarea
            id="settlement-note"
            placeholder="Optional settlement context for the household log"
            disabled={mutation.isPending}
            {...form.register("note")}
          />
          <FormFieldError message={form.formState.errors.note?.message} />
        </div>
      </FormSection>
      <FormActions
        isSubmitting={mutation.isPending}
        onCancel={onCancel}
        submitLabel="Settle debt"
        pendingLabel="Recording..."
      />
    </form>
  )
}
