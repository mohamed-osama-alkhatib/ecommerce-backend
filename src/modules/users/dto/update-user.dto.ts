// update-user.dto.ts

// libs
import { PartialType } from '@nestjs/mapped-types';
// dto
import { UserDto } from './user.dto';
// entities
import { Gender, Role } from '../entities/user.entity';

export class UpdateUserDto extends PartialType(UserDto) {
  avatar?: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  password?: string;
  gender?: Gender;
  role?: Role;
  city?: string;
  district?: string;
}
