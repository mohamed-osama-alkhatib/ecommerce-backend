// my-account.service.ts
// libs
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
// dto
import { UpdateMyAccountDto } from '../dto/update-my-account.dto';
// entities
import { User } from '../entities/user.entity';
import { City } from '../entities/city.entity';
import { District } from '../entities/district.entity';

@Injectable()
export class MyAccountService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(City)
    private cityRepository: Repository<City>,
    @InjectRepository(District)
    private districtRepository: Repository<District>,
  ) {}
  async display(payload) {
    const user = await this.userRepository.findOneBy({ id: payload.id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      status: 200,
      message: 'User found',
      data: user,
    };
  }

  async update(payload, updateMyAccountDto: UpdateMyAccountDto) {
    // check user
    const user = await this.userRepository.findOneBy({ id: payload.id });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { city, district, password, ...rest } = updateMyAccountDto as any;

    const updateData: Partial<User> = { ...rest };

    // final values after update
    const finalCityCode = city ?? user.city.code;
    const finalDistrictId = district ?? user.district.id;

    // validate city
    const isCity = await this.cityRepository.findOne({
      where: {
        code: finalCityCode,
      },
    });

    if (!isCity) {
      throw new NotFoundException('City not found');
    }

    // validate district belongs to city
    const isDistrict = await this.districtRepository.findOne({
      where: {
        id: finalDistrictId,
        city: {
          code: finalCityCode,
        },
      },
      relations: {
        city: true,
      },
    });

    if (!isDistrict) {
      throw new NotFoundException('District does not belong to selected city');
    }

    // update city & district
    updateData.city = isCity;
    updateData.district = isDistrict;

    // password
    if (password) {
      const saltOrRounds = Number(process.env.SALT_OR_ROUNDS);

      updateData.password = await bcrypt.hash(password, saltOrRounds);
    }

    // update
    await this.userRepository.update(payload.id, updateData);

    // get updated user
    const updatedUser = await this.userRepository.findOne({
      where: { id: payload.id },
      select: {
        id: true,
        avatar: true,
        firstName: true,
        lastName: true,
        age: true,
        gender: true,
        shamCashId: true,
        role: true,
        createdAt: true,
        phoneNumber: true,
        city: {
          code: true,
          name: true,
        },
        district: {
          id: true,
          name: true,
        },
      },
    });

    if (!updatedUser) {
      throw new NotFoundException('User not found after update');
    }

    return {
      status: 200,
      message: 'User updated successfully',
      data: updatedUser,
    };
  }

  async delete(payload) {
    // check user
    const user = await this.userRepository.findOneBy({ id: payload.id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepository.update(payload.id, { isActive: false });

    return {
      status: 200,
      message: 'User deleted successfully',
    };
  }
}
