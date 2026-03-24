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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createIncome } from "@/features/transactions/api/create-income"
import {
  createIncomeFormSchema,
  type CreateIncomeFormValues,
} from "@/features/transactions/schemas/create-income"
import type { Account } from "@/features/accounts/types/account"
import type { Category } from "@/features/categories/types/category"
import { applyProblemDetailsToForm } from "@/features/mutations/lib/form-errors"
import { useHouseholdMutation } from "@/features/mutations/hooks/use-household-mutation"
import { formatDateTimeInputValue, parseDateTimeInputToUtc } from "@/lib/format/date"
import { parseMoneyToMinor } from "@/lib/format/money"
import { queryKeys } from "@/lib/query-keys"

function getDefaultValues(accounts: Account[], categories: Category[]): CreateIncomeFormValues {
  return {
    accountId: accounts[0]?.id ?? "",
    categoryId: categories[0]?.id ?? "",
    amount: "",
    description: "",
    occurredAtLocal: formatDateTimeInputValue(new Date()),
  }
}

export function IncomeForm({
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
  const form = useForm<CreateIncomeFormValues>({
    resolver: zodResolver(createIncomeFormSchema),
    defaultValues: getDefaultValues(accounts, categories),
  })

  const mutation = useHouseholdMutation({
    mutationFn: (payload: Parameters<typeof createIncome>[1], idempotencyKey) =>
      createIncome(householdId, payload, idempotencyKey),
    invalidateKeys: [queryKeys.household(householdId)],
    successMessage: "Income recorded",
    idempotencyScope: "income",
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
        title="Income source"
        description="Select the receiving account and the source classification for this inflow."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <AccountSelect
            accounts={accounts}
            control={form.control}
            name="accountId"
            label="Receiving account"
            disabled={mutation.isPending}
          />
          <CategorySelect
            categories={categories}
            control={form.control}
            name="categoryId"
            label="Income source"
            disabled={mutation.isPending}
          />
        </div>
      </FormSection>
      <FormSection
        title="Income details"
        description="Capture the amount, description, and occurred-at timestamp for the household ledger."
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
          <Label htmlFor="income-description">Description</Label>
          <Input
            id="income-description"
            placeholder="Freelance invoice payout"
            disabled={mutation.isPending}
            {...form.register("description")}
          />
          <FormFieldError message={form.formState.errors.description?.message} />
        </div>
      </FormSection>
      <FormActions
        isSubmitting={mutation.isPending}
        onCancel={onCancel}
        submitLabel="Record income"
        pendingLabel="Recording..."
      />
    </form>
  )
}
