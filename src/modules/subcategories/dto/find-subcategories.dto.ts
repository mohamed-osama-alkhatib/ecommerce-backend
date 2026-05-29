// find-categories.dto.ts
// libs
import { IsIn, IsOptional, IsString } from 'class-validator';

export class FindSubcategoriesDto {
  // =========================================================
  // SORT
  // =========================================================

  @IsOptional()
  @IsIn(['createdAt', 'name'])
  sort?: string = 'createdAt';

  // =========================================================
  // ORDER
  // =========================================================

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC' = 'ASC';

  // =========================================================
  // SEARCH
  // =========================================================

  @IsOptional()
  @IsString()
  search?: string;
}
