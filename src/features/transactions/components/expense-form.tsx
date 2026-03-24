"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { FormActions } from "@/components/shared/forms/form-actions"
import { AmountField } from "@/components/shared/forms/amount-field"
import { DateField } from "@/components/shared/forms/date-field"
import { AccountSelect } from "@/components/shared/forms/account-select"
import { CategorySelect } from "@/components/shared/forms/category-select"
import { FormSection } from "@/components/shared/forms/form-section"
import { InlineFormError } from "@/components/shared/forms/inline-form-error"
import { FormFieldError } from "@/components/shared/forms/form-field-error"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createExpense } from "@/features/transactions/api/create-expense"
import {
  createExpenseFormSchema,
  type CreateExpenseFormValues,
} from "@/features/transactions/schemas/create-expense"
import type { Account } from "@/features/accounts/types/account"
import type { Category } from "@/features/categories/types/category"
import { applyProblemDetailsToForm } from "@/features/mutations/lib/form-errors"
import { useHouseholdMutation } from "@/features/mutations/hooks/use-household-mutation"
import { formatDateTimeInputValue, parseDateTimeInputToUtc } from "@/lib/format/date"
import { parseMoneyToMinor } from "@/lib/format/money"
import { queryKeys } from "@/lib/query-keys"

function getDefaultValues(accounts: Account[], categories: Category[]): CreateExpenseFormValues {
  return {
    accountId: accounts[0]?.id ?? "",
    categoryId: categories[0]?.id ?? "",
    amount: "",
    description: "",
    note: "",
    occurredAtLocal: formatDateTimeInputValue(new Date()),
    reference: "",
  }
}

export function ExpenseForm({
  householdId,
  accounts,
  categories,
  onCancel,
  onSuccess,
}: {
  householdId: string
  accounts: Account[]
  categories: Category[]
  onCancel: () => void
  onSuccess: () => void
}) {
  const [formError, setFormError] = useState("")
  const form = useForm<CreateExpenseFormValues>({
    resolver: zodResolver(createExpenseFormSchema),
    defaultValues: getDefaultValues(accounts, categories),
  })

  const mutation = useHouseholdMutation({
    mutationFn: (payload: Parameters<typeof createExpense>[1], idempotencyKey) =>
      createExpense(householdId, payload, idempotencyKey),
    invalidateKeys: [queryKeys.household(householdId)],
    successMessage: "Expense recorded",
    idempotencyScope: "expense",
    onSuccess: () => {
      form.reset(getDefaultValues(accounts, categories))
      setFormError("")
      onSuccess()
    },
  })

  const handleSubmit = form.handleSubmit(async (values) => {
    setFormError("")

    try {
      await mutation.mutateAsync({
        accountId: values.accountId,
        categoryId: values.categoryId,
        amountMinor: parseMoneyToMinor(values.amount),
        description: values.description?.trim() ? values.description.trim() : null,
        note: values.note?.trim() ? values.note.trim() : null,
        occurredAtUtc: parseDateTimeInputToUtc(values.occurredAtLocal),
        metadata: values.reference?.trim()
          ? { reference: values.reference.trim() }
          : null,
      })
    } catch (error) {
      setFormError(applyProblemDetailsToForm(error, form.setError))
    }
  })

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <InlineFormError message={formError} />
      <FormSection
        title="Transaction source"
        description="Choose where the household expense should be booked and categorized."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <AccountSelect
            accounts={accounts}
            control={form.control}
            name="accountId"
            label="Source account"
            disabled={mutation.isPending}
          />
          <CategorySelect
            categories={categories}
            control={form.control}
            name="categoryId"
            label="Expense category"
            disabled={mutation.isPending}
          />
        </div>
      </FormSection>
      <FormSection
        title="Expense details"
        description="Amounts are entered as decimals but submitted in backend-safe minor units."
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
          <Label htmlFor="expense-description">Description</Label>
          <Input
            id="expense-description"
            placeholder="Weekly grocery restock"
            disabled={mutation.isPending}
            {...form.register("description")}
          />
          <FormFieldError message={form.formState.errors.description?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="expense-note">Note</Label>
          <Textarea
            id="expense-note"
            placeholder="Optional note for the household activity log"
            disabled={mutation.isPending}
            {...form.register("note")}
          />
          <FormFieldError message={form.formState.errors.note?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="expense-reference">Reference</Label>
          <Input
            id="expense-reference"
            placeholder="Optional merchant or receipt reference"
            disabled={mutation.isPending}
            {...form.register("reference")}
          />
          <FormFieldError message={form.formState.errors.reference?.message} />
        </div>
      </FormSection>
      <FormActions
        isSubmitting={mutation.isPending}
        onCancel={onCancel}
        submitLabel="Record expense"
        pendingLabel="Recording..."
        secondaryAction={
          <Button
            type="button"
            variant="ghost"
            disabled={mutation.isPending}
            onClick={() => form.reset(getDefaultValues(accounts, categories))}
          >
            Reset fields
          </Button>
        }
      />
    </form>
  )
}
