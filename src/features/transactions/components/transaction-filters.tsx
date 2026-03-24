"use client"

import { useState, useTransition } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type {
  TransactionFilters,
  TransactionKindFilter,
  TransactionPeriod,
} from "@/features/transactions/types/transaction"

const filterKinds: TransactionKindFilter[] = ["ALL", "EXPENSE", "INCOME", "TRANSFER"]
const filterPeriods: TransactionPeriod[] = ["7d", "30d", "90d"]

export function TransactionFiltersBar({
  initialFilters,
}: {
  initialFilters: TransactionFilters
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [query, setQuery] = useState(initialFilters.query)
  const [period, setPeriod] = useState(initialFilters.period)
  const [kind, setKind] = useState(initialFilters.kind)

  function applyFilters(nextFilters: TransactionFilters) {
    const params = new URLSearchParams()

    if (nextFilters.kind !== "ALL") {
      params.set("kind", nextFilters.kind)
    }

    if (nextFilters.period !== "30d") {
      params.set("period", nextFilters.period)
    }

    if (nextFilters.query.trim().length > 0) {
      params.set("query", nextFilters.query.trim())
    }

    const nextHref = params.toString().length > 0 ? `${pathname}?${params}` : pathname

    startTransition(() => {
      router.replace(nextHref, { scroll: false })
    })
  }

  return (
    <div className="space-y-4 rounded-[var(--radius-lg)] border border-border/70 bg-card p-5 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {filterKinds.map((item) => (
            <Button
              key={item}
              type="button"
              variant={item === kind ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setKind(item)
                applyFilters({ kind: item, period, query })
              }}
            >
              {item}
            </Button>
          ))}
        </div>
        {isPending ? <Badge>Updating</Badge> : <Badge variant="primary">URL-synced</Badge>}
      </div>
      <form
        className="flex flex-col gap-3 md:flex-row"
        onSubmit={(event) => {
          event.preventDefault()
          applyFilters({ kind, period, query })
        }}
      >
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search description, category, or account"
            className="pl-9"
          />
        </div>
        <select
          value={period}
          onChange={(event) => {
            const nextPeriod = event.target.value as TransactionPeriod
            setPeriod(nextPeriod)
            applyFilters({ kind, period: nextPeriod, query })
          }}
          className="h-11 rounded-[var(--radius-md)] border border-input bg-background px-3.5 text-sm shadow-xs outline-none focus-visible:border-primary/50 focus-visible:ring-4 focus-visible:ring-primary/10"
          aria-label="Filter period"
        >
          {filterPeriods.map((item) => (
            <option key={item} value={item}>
              Last {item}
            </option>
          ))}
        </select>
        <Button type="submit">Apply filters</Button>
      </form>
    </div>
  )
}
