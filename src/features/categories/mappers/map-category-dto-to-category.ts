import type { CategoryDto } from "@/features/categories/schemas/category.dto"
import type { Category } from "@/features/categories/types/category"

export function mapCategoryDtoToCategory(categoryDto: CategoryDto): Category {
  return {
    id: categoryDto.id,
    name: categoryDto.name,
    kind: categoryDto.kind,
    isSystem: categoryDto.is_system,
  }
}
