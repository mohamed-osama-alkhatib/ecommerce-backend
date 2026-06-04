// find-categories.dto.ts
// libs
import { IsIn, IsOptional, IsString } from 'class-validator';

export class FindCouponsDto {
  // =========================================================
  // SORT
  // =========================================================

  @IsOptional()
  @IsIn(['createdAt', 'code', 'isActive'])
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
