import { Skeleton } from "@/components/ui/skeleton"

export function DashboardRouteSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="grid min-h-screen lg:grid-cols-[18rem_1fr]">
        <aside className="hidden border-r border-border/70 bg-sidebar p-6 lg:block">
          <Skeleton className="mb-8 h-12 w-40 bg-sidebar-accent" />
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full bg-sidebar-accent/80" />
            ))}
          </div>
        </aside>
        <div>
          <div className="border-b border-border/70 bg-background/90 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-10 w-36" />
            </div>
          </div>
          <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
            <Skeleton className="h-40 w-full rounded-[var(--radius-lg)]" />
            <div className="grid gap-6 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-72 w-full rounded-[var(--radius-lg)]" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
