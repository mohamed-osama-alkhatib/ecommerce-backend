// signup-user.dto.ts

// libs
import { PartialType } from '@nestjs/mapped-types';
// dto
import { UserDto } from '../../users/dto/user.dto';
// entities
import { Gender } from '../../../common/entities/user.entity';

export class SignUpUserDto extends PartialType(UserDto) {
  avatar?: string;
  firstName!: string;
  lastName!: string;
  dateOfBirth!: Date;
  email!: string;
  password!: string;
  verificationCode?: string;
  isActive?: boolean;
  gender!: Gender;
  city!: string;
  district!: string;
}
