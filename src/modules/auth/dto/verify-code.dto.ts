// verify-code.dto.ts

// libs
import { PartialType } from '@nestjs/mapped-types';
// dto
import { UserDto } from '../../users/dto/user.dto';

export class VerifyCodeDto extends PartialType(UserDto) {
  email!: string;
  verificationCode!: string;
}
