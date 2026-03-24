import { listHouseholds } from "@/features/households/api/get-household-context"
import { HouseholdSelectionScreen } from "@/features/households/components/household-selection-screen"

export default async function SelectHouseholdPage() {
  const households = await listHouseholds()

  return <HouseholdSelectionScreen households={households} />
}
