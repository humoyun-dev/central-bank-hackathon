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
import { createHousehold } from "@/features/households/api/create-household"
import {
  createHouseholdRequestSchema,
  type CreateHouseholdRequest,
} from "@/features/households/schemas/create-household"
import { applyProblemDetailsToForm } from "@/features/mutations/lib/form-errors"

export function CreateHouseholdForm() {
  const router = useRouter()
  const form = useForm<CreateHouseholdRequest>({
    resolver: zodResolver(createHouseholdRequestSchema),
    defaultValues: {
      name: "",
      currencyCode: "USD",
    },
  })

  const mutation = useMutation({
    mutationFn: createHousehold,
    onSuccess: (household) => {
      toast.success("Household created")
      form.reset({
        name: "",
        currencyCode: household.currencyCode,
      })
      router.push(`/${household.id}`)
      router.refresh()
    },
  })

  async function onSubmit(values: CreateHouseholdRequest) {
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
        title="Create household"
        description="Provision a new tenant-scoped workspace without leaving the secure selection shell."
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="household-name" className="text-sm font-medium text-foreground">
              Name
            </label>
            <Input
              id="household-name"
              {...form.register("name")}
              placeholder="Northstar Household"
            />
            <FormFieldError message={form.formState.errors.name?.message} />
          </div>
          <div className="space-y-2">
            <label htmlFor="currency-code" className="text-sm font-medium text-foreground">
              Base currency
            </label>
            <Controller
              control={form.control}
              name="currencyCode"
              render={({ field, fieldState }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="currency-code" aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder="Choose a base currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="UZS">UZS</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <FormFieldError message={form.formState.errors.currencyCode?.message} />
          </div>
        </div>
      </FormSection>

      <InlineFormError message={form.formState.errors.root?.message} />
      <FormActions
        isSubmitting={mutation.isPending}
        submitLabel="Create workspace"
        pendingLabel="Creating..."
        submitAdornment={
          mutation.isPending ? (
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          ) : undefined
        }
      />
    </form>
  )
}
