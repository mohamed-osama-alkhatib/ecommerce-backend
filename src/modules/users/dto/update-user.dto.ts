import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { Gender } from '../entities/user.entity';

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
}
