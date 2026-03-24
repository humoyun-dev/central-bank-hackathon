import type { BudgetDto } from "@/features/budgets/schemas/budget.dto"
import type { Budget } from "@/features/budgets/types/budget"

export function mapBudgetDtoToBudget(budgetDto: BudgetDto): Budget {
  return {
    id: budgetDto.id,
    categoryId: budgetDto.category_id,
    categoryName: budgetDto.category_name,
    period: budgetDto.period,
    currencyCode: budgetDto.currency_code,
    limitMinor: budgetDto.limit_minor,
    spentMinor: budgetDto.spent_minor,
    remainingMinor: budgetDto.remaining_minor,
    effectiveFromLocalDate: budgetDto.effective_from_local_date,
  }
}
