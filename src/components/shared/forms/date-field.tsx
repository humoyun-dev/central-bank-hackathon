"use client"

import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form"
import { FormFieldError } from "@/components/shared/forms/form-field-error"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface DateFieldProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  label: string
  description?: string
  type?: "date" | "datetime-local"
  disabled?: boolean
}

export function DateField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
  type = "datetime-local",
  disabled = false,
}: DateFieldProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className="space-y-2">
          <Label htmlFor={String(name)}>{label}</Label>
          {description ? (
            <p className="text-sm leading-6 text-muted-foreground">{description}</p>
          ) : null}
          <Input
            {...field}
            id={String(name)}
            type={type}
            aria-invalid={fieldState.invalid}
            disabled={disabled}
          />
          <FormFieldError message={fieldState.error?.message} />
        </div>
      )}
    />
  )
}
