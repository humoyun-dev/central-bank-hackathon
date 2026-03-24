import Link from "next/link"
import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"

export default function HouseholdNotFound() {
  return (
    <div className="mx-auto max-w-3xl py-8">
      <EmptyState
        title="Household not found"
        description="The requested household could not be resolved from the current workspace dataset. Choose another household to continue."
        action={
          <Button asChild>
            <Link href="/select-household">Select another household</Link>
          </Button>
        }
      />
    </div>
  )
}
