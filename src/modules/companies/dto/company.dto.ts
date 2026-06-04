import { Type } from 'class-transformer';
import {
  isArray,
  IsArray,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';
import { WorkingDays } from '../../../common/entities/company.entity';
import { City } from '../../../common/entities/city.entity';

export class CompanyDto {
  // =========================================================
  // NAME
  // =========================================================
  @IsString({ message: 'Name must be a string' })
  @Length(1, 60)
  name!: string;
  // =========================================================
  // LOGO
  // =========================================================
  @IsString({ message: 'Logo must be a string' })
  @IsUrl({}, { message: 'Invalid logo URL' })
  @IsOptional()
  logo?: string;
  // =========================================================
  // DESCRIPTION
  // =========================================================
  @IsString({ message: 'Description must be a string' })
  @Length(1, 200)
  @IsOptional()
  description?: string;
  // =========================================================
  // COMPLAINT NUMBER
  // =========================================================
  @IsString({ message: 'Complaint number must be a string' })
  @Length(1, 15)
  complaintNumber!: string;
  // =========================================================
  // FOUNDATION DATE
  // =========================================================
  @Type(() => Date)
  @IsDate({ message: 'Foundation date must be a valid date' })
  foundationDate!: Date;
  // =========================================================
  // TAX NUMBER
  // =========================================================
  @IsString({ message: 'Tax number must be a string' })
  taxNumber!: string;
  // =========================================================
  // WORKING DAYS
  // =========================================================
  @IsArray({ message: 'Working days must be an array' })
  @IsString({ each: true, message: 'Each working day must be a string' })
  @IsEnum(WorkingDays, {
    each: true,
    message:
      'Working days must be one of the following: saturday, sunday, monday, tuesday, wednesday, thursday, friday',
  })
  workingDays?: WorkingDays[];
  // =========================================================
  // SERVED CITIES
  // =========================================================
  @IsArray({ message: 'served cities must be an array' })
  @IsString({ each: true, message: 'Each served city must be a string' })
  @IsEnum(City, {
    each: true,
    message:
      'Served cities must be one of the following: 011, 021, 031, 041, 051, 061, 071, 081, 091, 101, 111, 121',
  })
  servedCities?: string[];
}
