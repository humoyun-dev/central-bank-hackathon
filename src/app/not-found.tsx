import Link from "next/link"
import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-4 py-10">
      <EmptyState
        title="This route could not be found"
        description="The requested screen either moved or has not been provisioned yet. Return to household selection and continue from a valid workspace."
        action={
          <Button asChild>
            <Link href="/select-household">Go to household selection</Link>
          </Button>
        }
      />
    </main>
  )
}
