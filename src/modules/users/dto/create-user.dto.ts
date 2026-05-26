// create-user.dto.ts

// libs
import { PartialType } from '@nestjs/mapped-types';
// dto
import { UserDto } from './user.dto';
// entities
import { Gender, Role } from '../entities/user.entity';

export class CreateUserDto extends PartialType(UserDto) {
  avatar?: string;
  firstName!: string;
  lastName!: string;
  age!: number;
  email!: string;
  password!: string;
  isActive?: boolean;
  gender!: Gender;
  role?: Role;
  city!: string;
  district!: string;
}
