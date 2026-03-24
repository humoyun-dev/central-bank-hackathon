"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useLocale, useTranslations } from "next-intl"
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
import { formatMoneyByLocale, parseMoneyToMinor } from "@/lib/format/money"
import { queryKeys } from "@/lib/query-keys"

function getDefaultValues(
  categories: Category[],
  effectiveFromLocalDate = "",
): UpsertBudgetFormValues {
  return {
    categoryId: categories[0]?.id ?? "",
    period: "MONTHLY",
    amount: "",
    effectiveFromLocalDate,
  }
}

function getBudgetValues(budget: Budget): UpsertBudgetFormValues {
  return {
    categoryId: budget.categoryId,
    period: budget.period,
    amount: (budget.limitMinor / 100).toFixed(2),
    effectiveFromLocalDate: budget.effectiveFromLocalDate,
  }
}

export function BudgetForm({
  householdId,
  categories,
  budgets,
  initialBudget,
  onCancel,
  onSuccess,
}: {
  householdId: string
  categories: Category[]
  budgets: Budget[]
  initialBudget?: Budget | undefined
  onCancel?: (() => void) | undefined
  onSuccess?: (() => void) | undefined
}) {
  const locale = useLocale()
  const t = useTranslations("budgets.form")
  const tCommon = useTranslations("budgets.common")
  const [formError, setFormError] = useState("")
  const form = useForm<UpsertBudgetFormValues>({
    resolver: zodResolver(upsertBudgetFormSchema),
    defaultValues: initialBudget ? getBudgetValues(initialBudget) : getDefaultValues(categories),
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
    ) ?? initialBudget ?? null

  useEffect(() => {
    if (initialBudget) {
      form.reset(getBudgetValues(initialBudget))
      return
    }

    form.reset(getDefaultValues(categories, formatDateInputValue(new Date())))
  }, [categories, form, initialBudget])

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
    successMessage: matchingBudget ? "budgets.toasts.updated" : "budgets.toasts.created",
    idempotencyScope: "budget",
    onSuccess: () => {
      form.reset(getDefaultValues(categories, formatDateInputValue(new Date())))
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
        title={t("sections.scope.title")}
        description={t("sections.scope.description")}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <CategorySelect
            categories={categories}
            control={form.control}
            name="categoryId"
            label={t("fields.category.label")}
            disabled={mutation.isPending}
          />
          <Controller
            control={form.control}
            name="period"
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Label htmlFor="budget-period">{t("fields.period.label")}</Label>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={mutation.isPending}
                >
                  <SelectTrigger id="budget-period" aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder={t("fields.period.placeholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MONTHLY">{tCommon("periods.monthly")}</SelectItem>
                    <SelectItem value="WEEKLY">{tCommon("periods.weekly")}</SelectItem>
                  </SelectContent>
                </Select>
                <FormFieldError message={fieldState.error?.message} />
              </div>
            )}
          />
        </div>
        {matchingBudget ? (
          <p className="text-sm leading-6 text-muted-foreground">
            {t("currentSavedLimit", {
              limit: formatMoneyByLocale(matchingBudget.limitMinor, matchingBudget.currencyCode, {
                locale,
              }),
              spent: formatMoneyByLocale(matchingBudget.spentMinor, matchingBudget.currencyCode, {
                locale,
              }),
            })}
          </p>
        ) : null}
      </FormSection>
      <FormSection
        title={t("sections.details.title")}
        description={t("sections.details.description")}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <AmountField
            control={form.control}
            name="amount"
            label={t("fields.amount.label")}
            disabled={mutation.isPending}
          />
          <DateField
            control={form.control}
            name="effectiveFromLocalDate"
            label={t("fields.effectiveFrom.label")}
            type="date"
            disabled={mutation.isPending}
          />
        </div>
      </FormSection>
      <FormActions
        isSubmitting={mutation.isPending}
        onCancel={onCancel}
        submitLabel={matchingBudget ? t("actions.update") : t("actions.create")}
        pendingLabel={t("actions.pending")}
      />
    </form>
  )
}
