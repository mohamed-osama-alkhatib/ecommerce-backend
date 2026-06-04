import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { CouponService } from '../services/coupon.service';
import { CreateCouponDto } from '../dto/create-coupon.dto';
import { UpdateCouponDto } from '../dto/update-coupon.dto';
import { AuthGuard } from '../../../common/guards/jwt-auth.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { FindCouponsDto } from '../dto/find-coupon.dto';

@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  // =========================================================
  // @Docs admin & employee can create coupon
  // @Route POST coupon
  // @Accuss private "admin"
  // =========================================================
  @Post()
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  create(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    createCouponDto: CreateCouponDto,
  ) {
    return this.couponService.create(createCouponDto);
  }

  // =========================================================
  // @Docs admin can get all coupons
  // @Route GET coupons
  // @Accuss private "admin & employee"
  // =========================================================
  @Get()
  @UseGuards(AuthGuard)
  @Roles(['admin', 'employee'])
  findAll(@Query() query: FindCouponsDto) {
    return this.couponService.findAll(query);
  }

  // =========================================================
  // @Docs admin & employee can get coupon
  // @Route GET one coupon/id
  // @Accuss public
  // =========================================================
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.couponService.findOne(id);
  }

  // =========================================================
  // @Docs admin & employee can update coupon
  // @Route PATCH coupon/id
  // @Accuss private "admin"
  // =========================================================
  @Patch(':id')
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    updateCouponDto: UpdateCouponDto,
  ) {
    return this.couponService.update(id, updateCouponDto);
  }

  // =========================================================
  // @Docs admin can delete coupon
  // @Route DELETE coupon/id
  // @Accuss private "admin"
  // =========================================================
  @Delete(':id')
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  remove(@Param('id') id: string) {
    return this.couponService.remove(id);
  }
}
