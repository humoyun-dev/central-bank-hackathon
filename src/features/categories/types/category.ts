export type CategoryKind = "EXPENSE" | "INCOME"

export interface Category {
  id: string
  name: string
  kind: CategoryKind
  isSystem: boolean
}
