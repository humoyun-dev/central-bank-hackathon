"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { FormActions } from "@/components/shared/forms/form-actions"
import { AmountField } from "@/components/shared/forms/amount-field"
import { DateField } from "@/components/shared/forms/date-field"
import { AccountSelect } from "@/components/shared/forms/account-select"
import { FormSection } from "@/components/shared/forms/form-section"
import { InlineFormError } from "@/components/shared/forms/inline-form-error"
import { FormFieldError } from "@/components/shared/forms/form-field-error"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createTransfer } from "@/features/transactions/api/create-transfer"
import {
  createTransferFormSchema,
  type CreateTransferFormValues,
} from "@/features/transactions/schemas/create-transfer"
import type { Account } from "@/features/accounts/types/account"
import { applyProblemDetailsToForm } from "@/features/mutations/lib/form-errors"
import { useHouseholdMutation } from "@/features/mutations/hooks/use-household-mutation"
import { formatDateTimeInputValue, parseDateTimeInputToUtc } from "@/lib/format/date"
import { parseMoneyToMinor } from "@/lib/format/money"
import { queryKeys } from "@/lib/query-keys"

function getDefaultValues(accounts: Account[]): CreateTransferFormValues {
  return {
    fromAccountId: accounts[0]?.id ?? "",
    toAccountId: accounts[1]?.id ?? "",
    amount: "",
    note: "",
    occurredAtLocal: formatDateTimeInputValue(new Date()),
  }
}

export function TransferForm({
  householdId,
  accounts,
  onCancel,
  onSuccess,
}: {
  householdId: string
  accounts: Account[]
  onCancel: () => void
  onSuccess: () => void
}) {
  const [formError, setFormError] = useState("")
  const form = useForm<CreateTransferFormValues>({
    resolver: zodResolver(createTransferFormSchema),
    defaultValues: getDefaultValues(accounts),
  })

  const sourceAccountId = useWatch({
    control: form.control,
    name: "fromAccountId",
  })
  const selectedSourceAccount =
    accounts.find((account) => account.id === sourceAccountId) ?? null

  const mutation = useHouseholdMutation({
    mutationFn: (payload: Parameters<typeof createTransfer>[1], idempotencyKey) =>
      createTransfer(householdId, payload, idempotencyKey),
    invalidateKeys: [queryKeys.household(householdId)],
    successMessage: "Transfer recorded",
    idempotencyScope: "transfer",
    onSuccess: () => {
      form.reset(getDefaultValues(accounts))
      setFormError("")
      onSuccess()
    },
  })

  const handleSubmit = form.handleSubmit(async (values) => {
    setFormError("")

    const sourceAccount = accounts.find((account) => account.id === values.fromAccountId)
    const destinationAccount = accounts.find((account) => account.id === values.toAccountId)

    if (sourceAccount && destinationAccount && sourceAccount.currencyCode !== destinationAccount.currencyCode) {
      form.setError("toAccountId", {
        type: "manual",
        message: "Cross-currency transfers will be supported in a later phase.",
      })
      return
    }

    try {
      await mutation.mutateAsync({
        fromAccountId: values.fromAccountId,
        toAccountId: values.toAccountId,
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
        title="Transfer path"
        description="Move available balance between two active household account surfaces."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <AccountSelect
            accounts={accounts}
            control={form.control}
            name="fromAccountId"
            label="From account"
            disabled={mutation.isPending}
          />
          <AccountSelect
            accounts={accounts}
            control={form.control}
            name="toAccountId"
            label="To account"
            disabled={mutation.isPending}
            excludeAccountId={sourceAccountId}
          />
        </div>
      </FormSection>
      <FormSection
        title="Transfer details"
        description="The current route will refresh after submit so account previews and recent activity stay aligned."
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
        {selectedSourceAccount ? (
          <p className="text-sm leading-6 text-muted-foreground">
            Available in source account: {selectedSourceAccount.currencyCode}{" "}
            {(selectedSourceAccount.availableBalanceMinor / 100).toFixed(2)}
          </p>
        ) : null}
        <div className="space-y-2">
          <Label htmlFor="transfer-note">Note</Label>
          <Textarea
            id="transfer-note"
            placeholder="Reserve top-up for the next spending cycle"
            disabled={mutation.isPending}
            {...form.register("note")}
          />
          <FormFieldError message={form.formState.errors.note?.message} />
        </div>
      </FormSection>
      <FormActions
        isSubmitting={mutation.isPending}
        onCancel={onCancel}
        submitLabel="Record transfer"
        pendingLabel="Recording..."
      />
    </form>
  )
}
