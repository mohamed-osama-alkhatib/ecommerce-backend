// users.service.ts
// libs
import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
  // ================================================================================ create
  async create(createUserDto: CreateUserDto): Promise<{
    status: number;
    message: string;
    data: User;
  }> {
    // city & district
    const { city, district, ...rest } = createUserDto;

    // check city
    const isCity = await this.cityRepository.findOne({
      where: { code: city },
    });

    if (!isCity) {
      throw new NotFoundException('City not found');
    }

    // check district belongs to city
    const isDistrict = await this.districtRepository.findOne({
      where: {
        id: district,
        city: {
          code: city,
        },
      },
      relations: {
        city: true,
      },
    });

    if (!isDistrict) {
      throw new NotFoundException('District does not belong to selected city');
    }

    // phone number
    const ifUserExist = await this.userRepository.findOne({
      where: { phoneNumber: createUserDto.phoneNumber },
    });

    if (ifUserExist) {
      throw new HttpException('User already exist', 400);
    }

    // password
    const saltOrRounds = Number(process.env.SALT_OR_ROUNDS);

    const password = await bcrypt.hash(createUserDto.password, saltOrRounds);

    // create user
    const user = this.userRepository.create({
      ...rest,
      city: isCity,
      district: isDistrict,
      password,
      isActive: true,
    });

    const savedUser = await this.userRepository.save(user);

    const createdUser = await this.userRepository.findOne({
      where: { id: savedUser.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        age: true,
        gender: true,
        phoneNumber: true,
        shamCashId: true,
        role: true,
        createdAt: true,
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

    if (!createdUser) {
      throw new NotFoundException('User not found after creation');
    }

    return {
      status: 201,
      message: 'User created successfully',
      data: createdUser,
    };
  }
  // ================================================================================ findAll
  async findAll(query) {
    const {
      limit = 10,
      skip = 0,

      // sorting
      sort = 'createdAt',
      order = 'ASC',

      // filters
      role,
      city,
      district,

      // search
      search,

      // age
      ages,
    } = query;

    const qb = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.city', 'city')
      .leftJoinAndSelect('user.district', 'district');

    // =========================================================
    // SEARCH
    // =========================================================
    // example:
    // ?search=اس

    if (search) {
      qb.andWhere(
        `
      (
        user.firstName ILIKE :search
        OR
        user.lastName ILIKE :search
      )
      `,
        {
          search: `%${search}%`,
        },
      );
    }

    // =========================================================
    // ROLE
    // =========================================================
    // example:
    // ?role=client

    if (role) {
      qb.andWhere('user.role = :role', {
        role,
      });
    }

    // =========================================================
    // CITY
    // =========================================================
    // example:
    // ?city=011

    if (city) {
      qb.andWhere('city.code = :city', {
        city,
      });
    }

    // =========================================================
    // DISTRICT
    // =========================================================
    // example:
    // ?district=0110001

    if (district) {
      qb.andWhere('district.id = :district', {
        district,
      });
    }

    // =========================================================
    // AGES
    // =========================================================
    // example:
    // ?ages=25,40,34

    if (ages?.length) {
      const agesArray = ages.map((age) => {
        const parsedAge = Number(age);

        if (isNaN(parsedAge)) {
          throw new BadRequestException(`Invalid age value: ${age}`);
        }

        if (parsedAge < 1 || parsedAge > 120) {
          throw new BadRequestException(`Invalid age range: ${age}`);
        }

        return parsedAge;
      });

      qb.andWhere('user.age IN (:...ages)', {
        ages: agesArray,
      });
    }

    // =========================================================
    // PAGINATION
    // =========================================================

    qb.skip(Number(skip));
    qb.take(Number(limit));

    // =========================================================
    // SORTING
    // =========================================================

    const allowedSortFields = [
      'createdAt',
      'firstName',
      'lastName',
      'age',
      'role',
    ];

    const finalSort = allowedSortFields.includes(sort) ? sort : 'createdAt';

    const finalOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    qb.orderBy(`user.${finalSort}`, finalOrder);

    // =========================================================
    // EXECUTE
    // =========================================================

    const [users, total] = await qb.getManyAndCount();

    return {
      status: 200,
      message: 'Users retrieved successfully',

      pagination: {
        total,
        limit: Number(limit),
        skip: Number(skip),
        pages: Math.ceil(total / Number(limit)),
      },

      filters: {
        role,
        city,
        district,
        search,
        ages,
      },

      data: users,
    };
  }
  // ================================================================================ findOne
  async findOne(id: string): Promise<{
    status: number;
    message: string;
    data: User;
  }> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
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
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      status: 200,
      message: 'User retrieved successfully',
      data: user,
    };
  }
  // ================================================================================ update
  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<{
    status: number;
    message: string;
    data: User;
  }> {
    // check user
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {
        city: true,
        district: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { city, district, password, ...rest } = updateUserDto;

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
    await this.userRepository.update(id, updateData);

    // get updated user
    const updatedUser = await this.userRepository.findOne({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        age: true,
        gender: true,
        phoneNumber: true,
        shamCashId: true,
        role: true,
        createdAt: true,
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
  // ================================================================================ delete
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
