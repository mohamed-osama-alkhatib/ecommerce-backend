// find-users.dto.ts
// libs
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
  Max,
  Matches,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class FindUsersDto {
  // =========================================================
  // PAGINATION
  // =========================================================

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number = 0;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  // =========================================================
  // SORT
  // =========================================================

  @IsOptional()
  @IsIn(['createdAt', 'firstName', 'lastName', 'age', 'role'])
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

  // =========================================================
  // ROLE
  // =========================================================

  @IsOptional()
  @IsIn(['admin', 'employee', 'client'])
  role?: string;

  // =========================================================
  // CITY
  // =========================================================

  @IsOptional()
  @Matches(/^\d{3}$/)
  city?: string;

  // =========================================================
  // DISTRICT
  // =========================================================

  @IsOptional()
  @Matches(/^\d{7}$/)
  district?: string;

  // =========================================================
  // AGES
  // =========================================================

  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return [];

    return value.split(',').map((age: string) => age.trim());
  })
  ages?: string[];
}
