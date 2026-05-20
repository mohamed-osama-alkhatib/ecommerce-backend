// users.service.ts
// libs
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
// dto
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// entity
import { User } from './entities/user.entity';
import { City } from './entities/city.entity';
import { District } from './entities/district.entity';

const DataResponse = [
  'createdAt',
  'id',
  'firstName',
  'lastName',
  'age',
  'gender',
  'phoneNumber',
  'city',
  'district',
  'shamCashId',
  'role',
];

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(City)
    private cityRepository: Repository<City>,
    @InjectRepository(District)
    private districtRepository: Repository<District>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<{
    status: number;
    message: string;
    data: User;
  }> {
    // city & district
    const { city, district, ...rest } = createUserDto;

    const isCity = await this.cityRepository.findOne({
      where: { code: city },
    });

    if (!isCity) {
      throw new NotFoundException('City not found');
    }

    const isDistrict = await this.districtRepository.findOne({
      where: { id: district },
    });

    if (!isDistrict) {
      throw new NotFoundException('District not found');
    }
    // city & district //
    // phone number
    const ifUserExist = await this.userRepository.findOne({
      where: { phoneNumber: createUserDto.phoneNumber },
    });
    if (ifUserExist) {
      throw new HttpException('User already exist', 400);
    }
    // phone number //
    // password
    const saltOrRounds = Number(process.env.SALT_OR_ROUNDS);
    const password = await bcrypt.hash(createUserDto.password, saltOrRounds);
    // password //
    const user = this.userRepository.create({
      ...rest,
      city: isCity,
      district: isDistrict,
      password,
    });

    return {
      status: 201,
      message: 'user created successfully',
      data: await this.userRepository.save(user),
    };
  }

  async findAll(): Promise<{
    status: number;
    message: string;
    data: User[];
  }> {
    return {
      status: 200,
      message: 'users retrieved successfully',
      data: await this.userRepository.find({
        select: DataResponse as (keyof User)[],
      }),
    };
  }

  async findOne(id: string): Promise<{
    status: number;
    message: string;
    data: User;
  }> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: DataResponse as (keyof User)[],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      status: 200,
      message: 'User retrieved successfully',
      data: user,
    };
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<{
    status: number;
    message: string;
    data: User;
  }> {
    // check
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    // check //

    const { city, district, password, ...rest } = updateUserDto;
    const updateData: any = { ...rest };

    // city & district

    if (city !== undefined) {
      const isCity = await this.cityRepository.findOne({
        where: { code: city },
      });

      if (!isCity) {
        throw new NotFoundException('City not found');
      }
      updateData.city = isCity;
    }
    if (district !== undefined) {
      const isDistrict = await this.districtRepository.findOne({
        where: { id: district },
      });

      if (!isDistrict) {
        throw new NotFoundException('District not found');
      }
      updateData.district = isDistrict;
    }
    // city & district //
    // password
    if (password) {
      const saltOrRounds = Number(process.env.SALT_OR_ROUNDS);
      updateData.password = await bcrypt.hash(password, saltOrRounds);
    }
    // password //

    await this.userRepository.update(id, updateData);

    const updatedUser = await this.userRepository.findOne({
      where: { id },
      select: DataResponse as (keyof User)[],
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

  async delete(id: string): Promise<{
    status: number;
    message: string;
  }> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.delete(id);

    return {
      status: 200,
      message: 'User deleted successfully',
    };
  }
}
