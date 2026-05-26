// change-password.dto.ts

// libs
import { PartialType } from '@nestjs/mapped-types';
// dto
import { UserDto } from '../../users/dto/user.dto';

export class ChangePasswordDto extends PartialType(UserDto) {
  email!: string;
  password!: string;
}
