import type { ReactNode } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface SectionCardProps {
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
  footer?: ReactNode
}

export function SectionCard({
  title,
  description,
  action,
  children,
  footer,
}: SectionCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="space-y-1">
          <CardTitle>{title}</CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </div>
        {action}
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
        {footer}
      </CardContent>
    </Card>
  )
}
