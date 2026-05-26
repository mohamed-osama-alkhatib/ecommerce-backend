// reset-password.dto.ts

// libs
import { PartialType } from '@nestjs/mapped-types';
// dto
import { UserDto } from '../../users/dto/user.dto';

export class ResetPasswordDto extends PartialType(UserDto) {
  email!: string;
}
