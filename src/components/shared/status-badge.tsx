import type { ComponentProps } from "react"
import { Badge } from "@/components/ui/badge"

type StatusTone = "neutral" | "primary" | "success" | "warning"

const toneMap: Record<StatusTone, ComponentProps<typeof Badge>["variant"]> = {
  neutral: "neutral",
  primary: "primary",
  success: "success",
  warning: "warning",
}

export function StatusBadge({
  label,
  tone = "neutral",
}: {
  label: string
  tone?: StatusTone
}) {
  return <Badge variant={toneMap[tone]}>{label}</Badge>
}
