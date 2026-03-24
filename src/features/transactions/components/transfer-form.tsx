"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { useTranslations } from "next-intl"
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

function getDefaultValues(
  accounts: Account[],
  occurredAtLocal = "",
): CreateTransferFormValues {
  return {
    fromAccountId: accounts[0]?.id ?? "",
    toAccountId: accounts[1]?.id ?? "",
    amount: "",
    note: "",
    occurredAtLocal,
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
  const t = useTranslations("transactions.transferForm")
  const [formError, setFormError] = useState("")
  const form = useForm<CreateTransferFormValues>({
    resolver: zodResolver(createTransferFormSchema),
    defaultValues: getDefaultValues(accounts),
  })

  useEffect(() => {
    if (!form.getValues("occurredAtLocal")) {
      form.setValue("occurredAtLocal", formatDateTimeInputValue(new Date()))
    }
  }, [form])

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
    successMessage: "transactions.toasts.transferRecorded",
    idempotencyScope: "transfer",
    onSuccess: () => {
      form.reset(getDefaultValues(accounts, formatDateTimeInputValue(new Date())))
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
        message: "validation.transactions.crossCurrencyUnsupported",
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
        title={t("sections.path.title")}
        description={t("sections.path.description")}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <AccountSelect
            accounts={accounts}
            control={form.control}
            name="fromAccountId"
            label={t("fields.fromAccountId.label")}
            disabled={mutation.isPending}
          />
          <AccountSelect
            accounts={accounts}
            control={form.control}
            name="toAccountId"
            label={t("fields.toAccountId.label")}
            disabled={mutation.isPending}
            excludeAccountId={sourceAccountId}
          />
        </div>
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
        {selectedSourceAccount ? (
          <p className="text-sm leading-6 text-muted-foreground">
            {t("availableInSource", {
              currencyCode: selectedSourceAccount.currencyCode,
              amount: (selectedSourceAccount.availableBalanceMinor / 100).toFixed(2),
            })}
          </p>
        ) : null}
        <div className="space-y-2">
          <Label htmlFor="transfer-note">{t("fields.note.label")}</Label>
          <Textarea
            id="transfer-note"
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
