// update-user.dto.ts
// libs
import { PartialType } from '@nestjs/mapped-types';
// dto
import { CreateUserDto } from './create-user.dto';
// entities
import { Gender, Role } from '../../../common/entities/user.entity';

export class UpdateMyAccountDto extends PartialType(CreateUserDto) {
  avatar?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  password?: string;
  city?: string;
  district?: string;
  gender?: Gender;
  role?: Role;
}
