interface FormFieldErrorProps {
  message?: string | undefined
}

export function FormFieldError({ message }: FormFieldErrorProps) {
  if (!message) {
    return null
  }

  return <p className="text-sm leading-5 text-destructive">{message}</p>
}
