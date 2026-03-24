import { Skeleton } from "@/components/ui/skeleton"

export function DashboardRouteSkeleton() {
  return (
    <div className="h-dvh overflow-hidden bg-[#eef3ff] lg:pl-[15rem] xl:pl-[15.5rem]">
      <div className="flex h-dvh min-w-0 overflow-hidden">
        <aside className="fixed inset-y-0 left-0 hidden w-[15rem] border-r border-border/70 bg-[#c9d6ff] p-6 lg:block xl:w-[15.5rem]">
          <Skeleton className="mb-8 h-12 w-40 bg-sidebar-accent" />
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full bg-sidebar-accent/80" />
            ))}
          </div>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-[#fcfbf7]">
          <div className="shrink-0 border-b border-border/70 bg-background/90 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-10 w-36" />
            </div>
          </div>
          <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
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
