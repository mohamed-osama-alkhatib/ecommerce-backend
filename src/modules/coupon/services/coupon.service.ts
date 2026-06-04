import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCouponDto } from '../dto/create-coupon.dto';
import { UpdateCouponDto } from '../dto/update-coupon.dto';
import { FindCouponsDto } from '../dto/find-coupon.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon } from '../../../common/entities/coupon.entity';

@Injectable()
export class CouponService {
  constructor(
    @InjectRepository(Coupon)
    private couponRepository: Repository<Coupon>,
  ) {}

  async create(createCouponDto: CreateCouponDto) {
    // name unique check
    const ifCouponExist = await this.couponRepository.findOne({
      where: { code: createCouponDto.code },
    });
    if (ifCouponExist) {
      throw new HttpException('Coupon already exist', 400);
    }

    const createdCoupon = await this.couponRepository.save(createCouponDto);
    return {
      status: 201,
      message: 'Coupon created successfully',
      data: createdCoupon,
    };
  }

  async findAll(query: FindCouponsDto) {
    const {
      // sorting
      sort = 'createdAt',
      order = 'ASC',
      // search
      search,
    } = query;

    const qb = await this.couponRepository.createQueryBuilder('coupon');

    // ========================
    // SEARCH
    // ========================
    // example:
    // ?search=اس

    if (search) {
      qb.andWhere(
        `
      (
        coupon.code ILIKE :search
      )
      `,
        {
          search: `%${search}%`,
        },
      );
    }

    // ========================
    // SORTING
    // ========================

    const allowedSortFields = ['createdAt', 'code', 'isActive'];

    const finalSort = allowedSortFields.includes(sort) ? sort : 'createdAt';

    const finalOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    qb.orderBy(`coupon.${finalSort}`, finalOrder);

    // ========================
    // EXECUTE
    // ========================

    const [coupon, total] = await qb.getManyAndCount();

    return {
      status: 200,
      message: 'Coupon retrieved successfully',
      count: total,
      filters: search,
      data: coupon,
    };
  }

  async findOne(id: string) {
    // check coupon exist
    const coupon = await this.couponRepository.findOne({
      where: { id },
    });

    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    return {
      status: 200,
      message: 'Coupon found successfully',
      data: coupon,
    };
  }

  async update(id: string, updateCouponDto: UpdateCouponDto) {
    // check coupon exist
    const coupon = await this.couponRepository.findOne({
      where: { id },
    });

    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    const updatedCoupon = await this.couponRepository.update(
      id,
      updateCouponDto,
    );

    return {
      status: 200,
      message: 'Coupon updated successfully',
      data: updatedCoupon,
    };
  }

  async remove(id: string) {
    // check coupon exist
    const coupon = await this.couponRepository.findOne({
      where: { id },
    });

    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    await this.couponRepository.update(id, { isActive: false });
    return {
      status: 200,
      message: 'Coupon removed successfully',
    };
  }
}
