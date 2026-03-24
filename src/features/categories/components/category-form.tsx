"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { LoaderCircle } from "lucide-react"
import { useTranslations } from "next-intl"
import { Controller, useForm } from "react-hook-form"
import { useEffect } from "react"
import { toast } from "sonner"
import { FormActions } from "@/components/shared/forms/form-actions"
import { FormFieldError } from "@/components/shared/forms/form-field-error"
import { FormSection } from "@/components/shared/forms/form-section"
import { InlineFormError } from "@/components/shared/forms/inline-form-error"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { applyProblemDetailsToForm } from "@/features/mutations/lib/form-errors"
import { createCategory } from "@/features/categories/api/create-category"
import {
  createCategoryRequestSchema,
  type CreateCategoryRequest,
} from "@/features/categories/schemas/create-category"
import { updateCategory } from "@/features/categories/api/update-category"
import type { Category } from "@/features/categories/types/category"
import { useRouter } from "@/i18n/navigation"

export function CategoryForm({
  householdId,
  category,
  onCancel,
  onSuccess,
}: {
  householdId: string
  category?: Category | undefined
  onCancel?: (() => void) | undefined
  onSuccess?: (() => void) | undefined
}) {
  const t = useTranslations("categories.form")
  const tCommon = useTranslations("categories.common")
  const router = useRouter()
  const isEditing = Boolean(category)
  const form = useForm<CreateCategoryRequest>({
    resolver: zodResolver(createCategoryRequestSchema),
    defaultValues: {
      name: category?.name ?? "",
      kind: category?.kind ?? "EXPENSE",
    },
  })

  useEffect(() => {
    form.reset({
      name: category?.name ?? "",
      kind: category?.kind ?? "EXPENSE",
    })
  }, [category, form])

  const mutation = useMutation({
    mutationFn: (values: CreateCategoryRequest) =>
      isEditing && category
        ? updateCategory(householdId, category.id, { name: values.name })
        : createCategory(householdId, values),
    onSuccess: () => {
      toast.success(t(isEditing ? "toasts.updated" : "toasts.created"))
      form.reset({
        name: "",
        kind: "EXPENSE",
      })
      onSuccess?.()
      router.refresh()
    },
  })

  async function onSubmit(values: CreateCategoryRequest) {
    form.clearErrors()

    try {
      await mutation.mutateAsync(values)
    } catch (error) {
      applyProblemDetailsToForm(error, form.setError)
    }
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FormSection
        title={isEditing ? t("sections.edit.title") : t("sections.create.title")}
        description={isEditing ? t("sections.edit.description") : t("sections.create.description")}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="category-name" className="text-sm font-medium text-foreground">
              {t("fields.name.label")}
            </label>
            <Input
              id="category-name"
              {...form.register("name")}
              placeholder={t("fields.name.placeholder")}
            />
            <FormFieldError message={form.formState.errors.name?.message} />
          </div>
          <div className="space-y-2">
            <label htmlFor="category-kind" className="text-sm font-medium text-foreground">
              {t("fields.kind.label")}
            </label>
            <Controller
              control={form.control}
              name="kind"
              render={({ field, fieldState }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={mutation.isPending || isEditing}
                >
                  <SelectTrigger
                    id="category-kind"
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectValue placeholder={t("fields.kind.placeholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EXPENSE">{tCommon("kinds.expense")}</SelectItem>
                    <SelectItem value="INCOME">{tCommon("kinds.income")}</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <FormFieldError message={form.formState.errors.kind?.message} />
          </div>
        </div>
      </FormSection>

      <InlineFormError message={form.formState.errors.root?.message} />
      <FormActions
        isSubmitting={mutation.isPending}
        onCancel={onCancel}
        submitLabel={isEditing ? t("actions.save") : t("actions.create")}
        pendingLabel={t("actions.pending")}
        submitAdornment={
          mutation.isPending ? (
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          ) : undefined
        }
      />
    </form>
  )
}
