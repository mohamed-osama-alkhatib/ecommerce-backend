import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsString,
  Length,
  Max,
  Min,
  MinDate,
} from 'class-validator';

export class CouponDto {
  // =========================================================
  // CODE
  // =========================================================
  @IsString({ message: 'Code must be a string' })
  @Length(1, 20, { message: 'Code must be between 1 and 20 characters' })
  code!: string;
  // =========================================================
  // DISCOUNT
  // =========================================================
  @IsNumber({}, { message: 'Discount must be a number' })
  @Min(0, { message: 'Discount must be at least 0' })
  @Max(1000000, { message: 'Discount must be at most 1000000' })
  discount!: number;
  // =========================================================
  // EXPIRE DATE
  // =========================================================
  @Type(() => Date)
  @IsDate({ message: 'Expire date must be a valid date' })
  @MinDate(new Date(), { message: 'Expire date must be in the future' })
  expireDate!: Date;
  // =========================================================
  // IS ACTIVE
  // =========================================================
  @Type(() => Boolean)
  @IsBoolean({ message: 'Active status must be a boolean' })
  isActive?: boolean;
}
