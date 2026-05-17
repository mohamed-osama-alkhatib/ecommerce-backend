import {
  IsString,
  IsInt,
  Min,
  Max,
  Length,
  IsEnum,
  IsNotEmpty,
  Matches,
} from 'class-validator';
import { Gender, Role } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  @Length(3, 15, { message: 'الاسم الأول يجب أن يكون بين 3 و 15 حرف' })
  firstName!: string;

  @IsString()
  @Length(3, 15, { message: 'الاسم الأخير يجب أن يكون بين 3 و 15 حرف' })
  lastName!: string;

  @IsInt()
  @Min(18, { message: 'العمر يجب أن يكون 18 أو أكثر' })
  @Max(120, { message: 'العمر يجب أن يكون 120 أو أقل' })
  age!: number;

  @IsString()
  @IsNotEmpty()
  cityCode!: string;

  @IsString()
  districtId!: string;

  @IsString()
  @Matches(/^09\d{8}$/, {
    message: 'رقم الهاتف يجب أن يبدأ بـ 09 ويتكون من 10 أرقام',
  })
  phoneNumber!: string;

  @IsEnum(Gender)
  gender!: Gender;

  @IsEnum(Role)
  role: Role = Role.CLIENT;
}
