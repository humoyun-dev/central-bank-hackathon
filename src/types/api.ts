export interface ProblemDetails {
  type?: string | undefined
  title?: string | undefined
  status?: number | undefined
  detail?: string | undefined
  instance?: string | undefined
  timestamp?: string | undefined
  errors?: Record<string, string[]> | undefined
}
