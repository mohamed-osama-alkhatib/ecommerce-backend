// create-user.dto.ts
import {
  IsString,
  IsInt,
  Min,
  Max,
  Length,
  IsEnum,
  Matches,
  IsUrl,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Gender, Role } from '../entities/user.entity';

export class CreateUserDto {
  // ----- AVATAR -------------------------------------------------------------
  @IsString({ message: 'Avatar must be a string' })
  @IsUrl({}, { message: 'Avatar must be a valid URL' })
  @IsOptional()
  avatar?: string;

  // ----- FIRST NAME -------------------------------------------------------------
  @IsString({ message: 'First name must be a string' })
  @Length(3, 15, {
    message: 'First name must be between 3 and 15 characters',
  })
  firstName!: string;

  // ----- LAST NAME -------------------------------------------------------------
  @IsString({ message: 'Last name must be a string' })
  @Length(3, 15, {
    message: 'Last name must be between 3 and 15 characters',
  })
  lastName!: string;

  // ----- AGE -------------------------------------------------------------
  @Type(() => Number)
  @IsInt({ message: 'Age must be a number' })
  @Min(18, { message: 'Age must be at least 18' })
  @Max(120, { message: 'Age must not exceed 120' })
  age!: number;

  // ----- CITY -------------------------------------------------------------
  @IsString({ message: 'City code must be a string' })
  @Length(3, 3, {
    message: 'City code must be exactly 3 characters',
  })
  city!: string;

  // ----- DISTRICT ID -------------------------------------------------------------
  @IsString({ message: 'District id must be a string' })
  @Length(7, 7, {
    message: 'District id must be exactly 7 characters',
  })
  district!: string;

  // ----- PHONE NUMBER -------------------------------------------------------------
  @IsString({ message: 'Phone number must be a string' })
  @Matches(/^09\d{8}$/, {
    message: 'Phone must start with 09 and contain 10 digits',
  })
  phoneNumber!: string;

  // ----- PASSWORD -------------------------------------------------------------
  @IsString({ message: 'Password must be a string' })
  @Length(8, 12, {
    message: 'Password must be between 8 and 12 characters',
  })
  password!: string;

  // ----- SHAMCASH ID -------------------------------------------------------------
  @IsString({ message: 'ShamCash ID must be a string' })
  @Length(16, 16, {
    message: 'ShamCash ID must be exactly 16 digits',
  })
  @IsOptional()
  shamCashId?: string;

  // ----- VERIFICATION CODE -------------------------------------------------------------
  @IsString({ message: 'Verification code must be a string' })
  @Length(6, 6, {
    message: 'Verification code must be exactly 6 digits',
  })
  @IsOptional()
  verificationCode?: string;

  // ----- IS ACTIVE -------------------------------------------------------------
  @Type(() => Boolean)
  @IsBoolean({ message: 'isActive must be true or false' })
  @IsOptional()
  isActive?: boolean;

  // ----- GENDER -------------------------------------------------------------
  @IsEnum(Gender, {
    message: 'Gender must be either male or female',
  })
  gender!: Gender;

  // ----- ROLE -------------------------------------------------------------
  @IsEnum(Role, {
    message: 'Role must be admin, employee, or client',
  })
  @IsOptional()
  role?: Role;

  // ----- XXXXX -------------------------------------------------------------
}
