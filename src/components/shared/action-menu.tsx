"use client"

import { MoreHorizontal } from "lucide-react"
import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ActionMenuItem {
  label: string
  icon?: ReactNode
  onSelect?: (() => void) | undefined
  disabled?: boolean | undefined
  shortcut?: string | undefined
}

export function ActionMenu({
  label = "Actions",
  items,
  align = "end",
}: {
  label?: string
  items: ActionMenuItem[]
  align?: "start" | "center" | "end"
}) {
  const visibleItems = items.filter((item) => item.onSelect || item.disabled)

  if (visibleItems.length === 0) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={label}
          className="rounded-full"
        >
          <MoreHorizontal className="size-4" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {visibleItems.map((item) => (
          <DropdownMenuItem
            key={item.label}
            {...(item.disabled !== undefined ? { disabled: item.disabled } : {})}
            onSelect={() => item.onSelect?.()}
          >
            {item.icon}
            <span>{item.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
