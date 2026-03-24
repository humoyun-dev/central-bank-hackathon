"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm, useWatch } from "react-hook-form"
import { useEffect, useState } from "react"
import { FormActions } from "@/components/shared/forms/form-actions"
import { AmountField } from "@/components/shared/forms/amount-field"
import { DateField } from "@/components/shared/forms/date-field"
import { CategorySelect } from "@/components/shared/forms/category-select"
import { FormSection } from "@/components/shared/forms/form-section"
import { InlineFormError } from "@/components/shared/forms/inline-form-error"
import { FormFieldError } from "@/components/shared/forms/form-field-error"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { upsertBudget } from "@/features/budgets/api/upsert-budget"
import type { Budget } from "@/features/budgets/types/budget"
import {
  upsertBudgetFormSchema,
  type UpsertBudgetFormValues,
} from "@/features/budgets/schemas/upsert-budget"
import type { Category } from "@/features/categories/types/category"
import { applyProblemDetailsToForm } from "@/features/mutations/lib/form-errors"
import { useHouseholdMutation } from "@/features/mutations/hooks/use-household-mutation"
import { formatDateInputValue } from "@/lib/format/date"
import { parseMoneyToMinor } from "@/lib/format/money"
import { queryKeys } from "@/lib/query-keys"

function getDefaultValues(categories: Category[]): UpsertBudgetFormValues {
  return {
    categoryId: categories[0]?.id ?? "",
    period: "MONTHLY",
    amount: "",
    effectiveFromLocalDate: formatDateInputValue(new Date()),
  }
}

export function BudgetForm({
  householdId,
  categories,
  budgets,
  onCancel,
  onSuccess,
}: {
  householdId: string
  categories: Category[]
  budgets: Budget[]
  onCancel?: (() => void) | undefined
  onSuccess?: (() => void) | undefined
}) {
  const [formError, setFormError] = useState("")
  const form = useForm<UpsertBudgetFormValues>({
    resolver: zodResolver(upsertBudgetFormSchema),
    defaultValues: getDefaultValues(categories),
  })

  const selectedCategoryId = useWatch({
    control: form.control,
    name: "categoryId",
  })
  const selectedPeriod = useWatch({
    control: form.control,
    name: "period",
  })
  const matchingBudget =
    budgets.find(
      (budget) =>
        budget.categoryId === selectedCategoryId && budget.period === selectedPeriod,
    ) ?? null

  useEffect(() => {
    if (!matchingBudget) {
      return
    }

    form.setValue("amount", (matchingBudget.limitMinor / 100).toFixed(2))
    form.setValue("effectiveFromLocalDate", matchingBudget.effectiveFromLocalDate)
  }, [form, matchingBudget])

  const mutation = useHouseholdMutation({
    mutationFn: (payload: Parameters<typeof upsertBudget>[1], idempotencyKey) =>
      upsertBudget(householdId, payload, idempotencyKey),
    invalidateKeys: [queryKeys.household(householdId)],
    successMessage: matchingBudget ? "Budget updated" : "Budget created",
    idempotencyScope: "budget",
    onSuccess: () => {
      form.reset(getDefaultValues(categories))
      setFormError("")
      onSuccess?.()
    },
  })

  const handleSubmit = form.handleSubmit(async (values) => {
    setFormError("")

    try {
      await mutation.mutateAsync({
        categoryId: values.categoryId,
        period: values.period,
        limitMinor: parseMoneyToMinor(values.amount),
        effectiveFromLocalDate: values.effectiveFromLocalDate,
      })
    } catch (error) {
      setFormError(applyProblemDetailsToForm(error, form.setError))
    }
  })

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <InlineFormError message={formError} />
      <FormSection
        title="Budget scope"
        description="Budgets in this phase govern expense categories and can be updated by reusing the same category + period combination."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <CategorySelect
            categories={categories}
            control={form.control}
            name="categoryId"
            label="Expense category"
            disabled={mutation.isPending}
          />
          <Controller
            control={form.control}
            name="period"
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Label htmlFor="budget-period">Period</Label>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={mutation.isPending}
                >
                  <SelectTrigger id="budget-period" aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder="Choose a budget period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MONTHLY">Monthly</SelectItem>
                    <SelectItem value="WEEKLY">Weekly</SelectItem>
                  </SelectContent>
                </Select>
                <FormFieldError message={fieldState.error?.message} />
              </div>
            )}
          />
        </div>
        {matchingBudget ? (
          <p className="text-sm leading-6 text-muted-foreground">
            Current saved limit: {(matchingBudget.limitMinor / 100).toFixed(2)}{" "}
            {matchingBudget.currencyCode} with {(matchingBudget.spentMinor / 100).toFixed(2)} spent.
          </p>
        ) : null}
      </FormSection>
      <FormSection
        title="Budget details"
        description="Saving again with the same category and period updates the existing budget limit."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <AmountField
            control={form.control}
            name="amount"
            label="Budget limit"
            disabled={mutation.isPending}
          />
          <DateField
            control={form.control}
            name="effectiveFromLocalDate"
            label="Effective from"
            type="date"
            disabled={mutation.isPending}
          />
        </div>
      </FormSection>
      <FormActions
        isSubmitting={mutation.isPending}
        onCancel={onCancel}
        submitLabel={matchingBudget ? "Update budget" : "Create budget"}
        pendingLabel="Saving..."
      />
    </form>
  )
}
