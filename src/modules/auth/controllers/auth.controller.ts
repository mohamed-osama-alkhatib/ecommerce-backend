// auth.controller.ts

// libs
import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
// services
import { AuthService } from '../services/auth.service';
// dto
import { SignUpUserDto } from '../dto/signup-user.dto';
import { SignInUserDto } from '../dto/signin-user.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { VerifyCodeDto } from '../dto/verify-code.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // =========================================================
  // @Docs user can signUp user
  // @Route POST auth/signup
  // @Accuss public
  // =========================================================
  @Post('sign-up')
  signUp(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    signUpUserDto: SignUpUserDto,
  ) {
    return this.authService.signUp(signUpUserDto);
  }

  // =========================================================
  // @Docs user can signIn user
  // @Route POST auth/sign-in
  // @Accuss public
  // =========================================================
  @Post('sign-in')
  signIn(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    signInUserDto: SignInUserDto,
  ) {
    return this.authService.signIn(signInUserDto);
  }

  // =========================================================
  // @Docs user can reset password
  // @Route POST auth/reset-password
  // @Accuss public
  // =========================================================
  @Post('reset-password')
  resetPassword(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    resetPasswordDto: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  // =========================================================
  // @Docs user can verify code
  // @Route POST auth/verify-code
  // @Accuss public
  // =========================================================
  @Post('verify-code')
  verifyCode(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    verifyCodeDto: VerifyCodeDto,
  ) {
    return this.authService.verifyCode(verifyCodeDto);
  }

  // =========================================================
  // @Docs user can change password
  // @Route POST auth/change-password
  // @Accuss public
  // =========================================================
  @Post('change-password')
  changePassword(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(changePasswordDto);
  }
}
