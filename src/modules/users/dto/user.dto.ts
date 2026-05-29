// user.dto.ts

// libs
import {
  IsString,
  Length,
  IsEnum,
  Matches,
  IsUrl,
  IsBoolean,
  IsOptional,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
// entities
import { Gender, Role } from '../../../common/entities/user.entity';

export class UserDto {
  // =========================================================
  // AVATAR
  // =========================================================
  @IsString({ message: 'Avatar must be a string' })
  @IsUrl({}, { message: 'Avatar must be a valid URL' })
  @IsOptional()
  avatar?: string;
  // =========================================================
  // FIRST NAME
  // =========================================================
  @IsString({ message: 'First name must be a string' })
  @Length(3, 15, {
    message: 'First name must be between 3 and 15 characters',
  })
  firstName!: string;
  // =========================================================
  // LAST NAME
  // =========================================================
  @IsString({ message: 'Last name must be a string' })
  @Length(3, 15, {
    message: 'Last name must be between 3 and 15 characters',
  })
  lastName!: string;
  // =========================================================
  // DATE OF BIRTH
  // =========================================================
  @Type(() => Date)
  @IsDate({ message: 'Date of birth must be a valid date' })
  dateOfBirth!: Date;
  // =========================================================
  // EMAIL
  // =========================================================
  @IsString({ message: 'Email must be a string' })
  @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
    message: 'Email must be a valid email address',
  })
  email!: string;
  // =========================================================
  // PASSWORD
  // =========================================================
  @IsString({ message: 'Password must be a string' })
  @Length(8, 12, {
    message: 'Password must be between 8 and 12 characters',
  })
  password!: string;
  // =========================================================
  //  VERIFICATION CODE
  // =========================================================
  @IsString({ message: 'Verification code must be a string' })
  @Length(6, 6, {
    message: 'Verification code must be exactly 6 digits',
  })
  @IsOptional()
  verificationCode?: string;
  // =========================================================
  // IS ACTIVE
  // =========================================================
  @Type(() => Boolean)
  @IsBoolean({ message: 'isActive must be true or false' })
  @IsOptional()
  isActive?: boolean;
  // =========================================================
  // GENDER
  // =========================================================
  @IsEnum(Gender, {
    message: 'Gender must be either male or female',
  })
  gender!: Gender;
  // =========================================================
  // ROLE
  // =========================================================
  @IsEnum(Role, {
    message: 'Role must be admin, employee, or client',
  })
  @IsOptional()
  role?: Role;
  // =========================================================
  // CITY
  // =========================================================
  @IsString({ message: 'City code must be a string' })
  @Length(3, 3, {
    message: 'City code must be exactly 3 characters',
  })
  city!: string;
  // =========================================================
  // DISTRICT
  // =========================================================
  @IsString({ message: 'District id must be a string' })
  @Length(7, 7, {
    message: 'District id must be exactly 7 characters',
  })
  district!: string;
  // =========================================================
  //
  // =========================================================
}
