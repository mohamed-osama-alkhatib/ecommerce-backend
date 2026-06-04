import { PartialType } from '@nestjs/mapped-types';
import { CouponDto } from './coupon.dto';

export class CreateCouponDto extends PartialType(CouponDto) {
  code!: string;
  discount!: number;
  expireDate!: Date;
}
