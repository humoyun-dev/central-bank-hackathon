"use client"

import { zodResolver } from "@hookform/resolvers/zod"
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

function getDefaultValues(): CreateDebtFormValues {
  return {
    counterpartyName: "",
    direction: "PAYABLE",
    amount: "",
    description: "",
    dueAtLocalDate: formatDateInputValue(new Date()),
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
  const [formError, setFormError] = useState("")
  const form = useForm<CreateDebtFormValues>({
    resolver: zodResolver(createDebtFormSchema),
    defaultValues: getDefaultValues(),
  })

  const mutation = useHouseholdMutation({
    mutationFn: (payload: Parameters<typeof createDebt>[1], idempotencyKey) =>
      createDebt(householdId, payload, idempotencyKey),
    invalidateKeys: [queryKeys.household(householdId)],
    successMessage: "Debt record created",
    idempotencyScope: "debt",
    onSuccess: () => {
      form.reset(getDefaultValues())
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
        title="Counterparty"
        description="Capture who owes the household or who the household needs to reimburse."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="debt-counterparty">Person or member</Label>
            <Input
              id="debt-counterparty"
              placeholder="Anna"
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
                <Label htmlFor="debt-direction">Direction</Label>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={mutation.isPending}
                >
                  <SelectTrigger id="debt-direction" aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder="Choose debt direction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PAYABLE">Household owes someone</SelectItem>
                    <SelectItem value="RECEIVABLE">Someone owes the household</SelectItem>
                  </SelectContent>
                </Select>
                <FormFieldError message={fieldState.error?.message} />
              </div>
            )}
          />
        </div>
      </FormSection>
      <FormSection
        title="Debt terms"
        description="Use a due date if the settlement should be expected by a specific day."
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
            label="Due date"
            type="date"
            disabled={mutation.isPending}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="debt-description">Description</Label>
          <Textarea
            id="debt-description"
            placeholder="Why this reimbursement or receivable exists"
            disabled={mutation.isPending}
            {...form.register("description")}
          />
          <FormFieldError message={form.formState.errors.description?.message} />
        </div>
      </FormSection>
      <FormActions
        isSubmitting={mutation.isPending}
        onCancel={onCancel}
        submitLabel="Create debt"
        pendingLabel="Creating..."
      />
    </form>
  )
}
