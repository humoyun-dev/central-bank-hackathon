"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { LoaderCircle } from "lucide-react"
import { useTranslations } from "next-intl"
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
import { useRouter } from "@/i18n/navigation"
import { applyProblemDetailsToForm } from "@/features/mutations/lib/form-errors"

export function CreateHouseholdForm() {
  const t = useTranslations("households.createForm")
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
      toast.success(t("success"))
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
        title={t("title")}
        description={t("description")}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="household-name" className="text-sm font-medium text-foreground">
              {t("fields.name.label")}
            </label>
            <Input
              id="household-name"
              {...form.register("name")}
              placeholder={t("fields.name.placeholder")}
            />
            <FormFieldError message={form.formState.errors.name?.message} />
          </div>
          <div className="space-y-2">
            <label htmlFor="currency-code" className="text-sm font-medium text-foreground">
              {t("fields.currencyCode.label")}
            </label>
            <Controller
              control={form.control}
              name="currencyCode"
              render={({ field, fieldState }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="currency-code" aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder={t("fields.currencyCode.placeholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">{t("currencies.USD")}</SelectItem>
                    <SelectItem value="EUR">{t("currencies.EUR")}</SelectItem>
                    <SelectItem value="UZS">{t("currencies.UZS")}</SelectItem>
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
        submitLabel={t("submit")}
        pendingLabel={t("pending")}
        submitAdornment={
          mutation.isPending ? (
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          ) : undefined
        }
      />
    </form>
  )
}
