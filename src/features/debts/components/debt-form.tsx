"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { useState } from "react"
import { FormActions } from "@/components/shared/forms/form-actions"
import { AmountField } from "@/components/shared/forms/amount-field"
import { DateField } from "@/components/shared/forms/date-field"
import { FormSection } from "@/components/shared/forms/form-section"
import { InlineFormError } from "@/components/shared/forms/inline-form-error"
import { FormFieldError } from "@/components/shared/forms/form-field-error"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { createDebt } from "@/features/debts/api/create-debt"
import {
  createDebtFormSchema,
  type CreateDebtFormValues,
} from "@/features/debts/schemas/create-debt"
import { applyProblemDetailsToForm } from "@/features/mutations/lib/form-errors"
import { useHouseholdMutation } from "@/features/mutations/hooks/use-household-mutation"
import { formatDateInputValue, parseDateInputToUtc } from "@/lib/format/date"
import { parseMoneyToMinor } from "@/lib/format/money"
import { queryKeys } from "@/lib/query-keys"

function getDefaultValues(dueAtLocalDate = ""): CreateDebtFormValues {
  return {
    counterpartyName: "",
    direction: "PAYABLE",
    amount: "",
    description: "",
    dueAtLocalDate,
  }
}

export function DebtForm({
  householdId,
  onCancel,
  onSuccess,
}: {
  householdId: string
  onCancel?: (() => void) | undefined
  onSuccess?: (() => void) | undefined
}) {
  const t = useTranslations("debts.form")
  const [formError, setFormError] = useState("")
  const form = useForm<CreateDebtFormValues>({
    resolver: zodResolver(createDebtFormSchema),
    defaultValues: getDefaultValues(),
  })

  useEffect(() => {
    if (!form.getValues("dueAtLocalDate")) {
      form.setValue("dueAtLocalDate", formatDateInputValue(new Date()))
    }
  }, [form])

  const mutation = useHouseholdMutation({
    mutationFn: (payload: Parameters<typeof createDebt>[1], idempotencyKey) =>
      createDebt(householdId, payload, idempotencyKey),
    invalidateKeys: [queryKeys.household(householdId)],
    successMessage: "debts.toasts.created",
    idempotencyScope: "debt",
    onSuccess: () => {
      form.reset(getDefaultValues(formatDateInputValue(new Date())))
      setFormError("")
      onSuccess?.()
    },
  })

  const handleSubmit = form.handleSubmit(async (values) => {
    setFormError("")

    try {
      await mutation.mutateAsync({
        counterpartyName: values.counterpartyName.trim(),
        direction: values.direction,
        amountMinor: parseMoneyToMinor(values.amount),
        description: values.description?.trim() ? values.description.trim() : null,
        dueAtUtc: values.dueAtLocalDate ? parseDateInputToUtc(values.dueAtLocalDate) : null,
      })
    } catch (error) {
      setFormError(applyProblemDetailsToForm(error, form.setError))
    }
  })

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <InlineFormError message={formError} />
      <FormSection
        title={t("sections.counterparty.title")}
        description={t("sections.counterparty.description")}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="debt-counterparty">{t("fields.counterparty.label")}</Label>
            <Input
              id="debt-counterparty"
              placeholder={t("fields.counterparty.placeholder")}
              disabled={mutation.isPending}
              {...form.register("counterpartyName")}
            />
            <FormFieldError message={form.formState.errors.counterpartyName?.message} />
          </div>
          <Controller
            control={form.control}
            name="direction"
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Label htmlFor="debt-direction">{t("fields.direction.label")}</Label>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={mutation.isPending}
                >
                  <SelectTrigger id="debt-direction" aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder={t("fields.direction.placeholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PAYABLE">{t("fields.direction.payable")}</SelectItem>
                    <SelectItem value="RECEIVABLE">{t("fields.direction.receivable")}</SelectItem>
                  </SelectContent>
                </Select>
                <FormFieldError message={fieldState.error?.message} />
              </div>
            )}
          />
        </div>
      </FormSection>
      <FormSection
        title={t("sections.terms.title")}
        description={t("sections.terms.description")}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <AmountField
            control={form.control}
            name="amount"
            disabled={mutation.isPending}
          />
          <DateField
            control={form.control}
            name="dueAtLocalDate"
            label={t("fields.dueDate.label")}
            type="date"
            disabled={mutation.isPending}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="debt-description">{t("fields.description.label")}</Label>
          <Textarea
            id="debt-description"
            placeholder={t("fields.description.placeholder")}
            disabled={mutation.isPending}
            {...form.register("description")}
          />
          <FormFieldError message={form.formState.errors.description?.message} />
        </div>
      </FormSection>
      <FormActions
        isSubmitting={mutation.isPending}
        onCancel={onCancel}
        submitLabel={t("actions.create")}
        pendingLabel={t("actions.creating")}
      />
    </form>
  )
}
