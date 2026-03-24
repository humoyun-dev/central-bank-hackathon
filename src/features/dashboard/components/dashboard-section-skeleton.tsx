import { Skeleton } from "@/components/ui/skeleton"

export function DashboardSectionSkeleton({
  titleWidth = "w-48",
  rowCount = 3,
  cardHeight = "h-32",
}: {
  titleWidth?: string
  rowCount?: number
  cardHeight?: string
}) {
  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <Skeleton className={`h-9 ${titleWidth}`} />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="grid gap-4">
        {Array.from({ length: rowCount }).map((_, index) => (
          <Skeleton key={index} className={`w-full rounded-[1.75rem] ${cardHeight}`} />
        ))}
      </div>
    </section>
  )
}
