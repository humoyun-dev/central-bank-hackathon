"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { LoaderCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
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

export function CategoryForm({ householdId }: { householdId: string }) {
  const router = useRouter()
  const form = useForm<CreateCategoryRequest>({
    resolver: zodResolver(createCategoryRequestSchema),
    defaultValues: {
      name: "",
      kind: "EXPENSE",
    },
  })

  const mutation = useMutation({
    mutationFn: (values: CreateCategoryRequest) => createCategory(householdId, values),
    onSuccess: () => {
      toast.success("Category saved")
      form.reset({
        name: "",
        kind: "EXPENSE",
      })
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
        title="Create category"
        description="Household categories stay separate from system defaults and future backend conflicts are normalized at the boundary."
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="category-name" className="text-sm font-medium text-foreground">
              Name
            </label>
            <Input
              id="category-name"
              {...form.register("name")}
              placeholder="School fees"
            />
            <FormFieldError message={form.formState.errors.name?.message} />
          </div>
          <div className="space-y-2">
            <label htmlFor="category-kind" className="text-sm font-medium text-foreground">
              Kind
            </label>
            <Controller
              control={form.control}
              name="kind"
              render={({ field, fieldState }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="category-kind" aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder="Choose a category kind" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EXPENSE">Expense</SelectItem>
                    <SelectItem value="INCOME">Income</SelectItem>
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
        submitLabel="Create category"
        pendingLabel="Saving..."
        submitAdornment={
          mutation.isPending ? (
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          ) : undefined
        }
      />
    </form>
  )
}
