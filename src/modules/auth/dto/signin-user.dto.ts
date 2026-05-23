// signin-user.dto.ts

// libs
import { IsString, Length, Matches } from 'class-validator';

export class SignInUserDto {
  // =========================================================
  // PHONE NUMBER
  // =========================================================
  @IsString({ message: 'Phone number must be a string' })
  @Matches(/^09\d{8}$/, {
    message: 'Phone must start with 09 and contain 10 digits',
  })
  phoneNumber!: string;
  // =========================================================
  // PASSWORD
  // =========================================================
  @IsString({ message: 'Password must be a string' })
  @Length(8, 12, {
    message: 'Password must be between 8 and 12 characters',
  })
  password!: string;
  // =========================================================
  //
  // =========================================================
}
