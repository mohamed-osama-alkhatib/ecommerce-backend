// update-user.dto.ts
// libs
import { PartialType } from '@nestjs/mapped-types';
// dto
import { CreateUserDto } from './create-user.dto';
// entities
import { Gender, Role } from '../entities/user.entity';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  avatar?: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  password?: string;
  city?: string;
  district?: string;
  shamCashId?: string;
  gender?: Gender;
  role?: Role;
}
