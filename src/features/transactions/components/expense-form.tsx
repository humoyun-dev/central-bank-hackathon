"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslations } from "next-intl"
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

function getDefaultValues(
  accounts: Account[],
  categories: Category[],
  occurredAtLocal = "",
): CreateExpenseFormValues {
  return {
    accountId: accounts[0]?.id ?? "",
    categoryId: categories[0]?.id ?? "",
    amount: "",
    description: "",
    note: "",
    occurredAtLocal,
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
  const t = useTranslations("transactions.expenseForm")
  const [formError, setFormError] = useState("")
  const form = useForm<CreateExpenseFormValues>({
    resolver: zodResolver(createExpenseFormSchema),
    defaultValues: getDefaultValues(accounts, categories),
  })

  useEffect(() => {
    if (!form.getValues("occurredAtLocal")) {
      form.setValue("occurredAtLocal", formatDateTimeInputValue(new Date()))
    }
  }, [form])

  const mutation = useHouseholdMutation({
    mutationFn: (payload: Parameters<typeof createExpense>[1], idempotencyKey) =>
      createExpense(householdId, payload, idempotencyKey),
    invalidateKeys: [queryKeys.household(householdId)],
    successMessage: "transactions.toasts.expenseRecorded",
    idempotencyScope: "expense",
    onSuccess: () => {
      form.reset(
        getDefaultValues(accounts, categories, formatDateTimeInputValue(new Date())),
      )
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
        title={t("sections.source.title")}
        description={t("sections.source.description")}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <AccountSelect
            accounts={accounts}
            control={form.control}
            name="accountId"
            label={t("fields.accountId.label")}
            disabled={mutation.isPending}
          />
          <CategorySelect
            categories={categories}
            control={form.control}
            name="categoryId"
            label={t("fields.categoryId.label")}
            disabled={mutation.isPending}
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
        <div className="space-y-2">
          <Label htmlFor="expense-description">{t("fields.description.label")}</Label>
          <Input
            id="expense-description"
            placeholder={t("fields.description.placeholder")}
            disabled={mutation.isPending}
            {...form.register("description")}
          />
          <FormFieldError message={form.formState.errors.description?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="expense-note">{t("fields.note.label")}</Label>
          <Textarea
            id="expense-note"
            placeholder={t("fields.note.placeholder")}
            disabled={mutation.isPending}
            {...form.register("note")}
          />
          <FormFieldError message={form.formState.errors.note?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="expense-reference">{t("fields.reference.label")}</Label>
          <Input
            id="expense-reference"
            placeholder={t("fields.reference.placeholder")}
            disabled={mutation.isPending}
            {...form.register("reference")}
          />
          <FormFieldError message={form.formState.errors.reference?.message} />
        </div>
      </FormSection>
      <FormActions
        isSubmitting={mutation.isPending}
        onCancel={onCancel}
        submitLabel={t("actions.submit")}
        pendingLabel={t("actions.pending")}
        secondaryAction={
          <Button
            type="button"
            variant="ghost"
            disabled={mutation.isPending}
            onClick={() =>
              form.reset(
                getDefaultValues(accounts, categories, formatDateTimeInputValue(new Date())),
              )
            }
          >
            {t("actions.reset")}
          </Button>
        }
      />
    </form>
  )
}
