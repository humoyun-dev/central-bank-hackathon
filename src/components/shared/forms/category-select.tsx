"use client"

import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form"
import { useTranslations } from "next-intl"
import { FormFieldError } from "@/components/shared/forms/form-field-error"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Category } from "@/features/categories/types/category"

interface CategorySelectProps<TFieldValues extends FieldValues> {
  categories: Category[]
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  label?: string
  description?: string
  disabled?: boolean
}

export function CategorySelect<TFieldValues extends FieldValues>({
  categories,
  control,
  name,
  label = "Category",
  description,
  disabled = false,
}: CategorySelectProps<TFieldValues>) {
  const t = useTranslations("forms.common")

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className="space-y-2">
          <Label htmlFor={String(name)}>{label === "Category" ? t("categoryLabel") : label}</Label>
          {description ? (
            <p className="text-sm leading-6 text-muted-foreground">{description}</p>
          ) : null}
          <Select
            value={field.value}
            onValueChange={field.onChange}
            disabled={disabled}
          >
            <SelectTrigger id={String(name)} aria-invalid={fieldState.invalid}>
              <SelectValue placeholder={t("categoryPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormFieldError message={fieldState.error?.message} />
        </div>
      )}
    />
  )
}
