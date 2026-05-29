// users.service.ts
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
// dto
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { FindUsersDto } from '../dto/find-users.dto';
// entity
import { User } from '../../../common/entities/user.entity';
import { City } from '../../../common/entities/city.entity';
import { District } from '../../../common/entities/district.entity';

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

  // =========================================================
  // CREATE
  // =========================================================
  async create(createUserDto: CreateUserDto): Promise<{
    status: number;
    message: string;
    data: User;
  }> {
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
        city: { code: city },
      },
    });
    if (!isDistrict) {
      throw new NotFoundException('District does not belong to selected city');
    }

    // email check
    const ifUserExist = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (ifUserExist) {
      throw new HttpException('User already exist', 400);
    }

    // password hashing
    const saltOrRounds = Number(process.env.SALT_OR_ROUNDS);
    const password = await bcrypt.hash(createUserDto.password, saltOrRounds);

    // create & save user
    const user = this.userRepository.create({
      ...rest,
      city: isCity,
      district: isDistrict,
      password,
      isActive: true,
    });
    const savedUser = await this.userRepository.save(user);

    const userData = await this.findOneDataOnly(savedUser.id);

    return {
      status: 201,
      message: 'User created successfully',
      data: userData,
    };
  }

  // =========================================================
  // FIND ALL
  // =========================================================
  async findAll(query: FindUsersDto) {
    const {
      limit = 10,
      skip = 0,
      sort = 'createdAt',
      order = 'ASC',
      role,
      city,
      district,
      search,
    } = query;

    const qb = this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.city', 'city')
      .leftJoin('user.district', 'district')
      .select([
        'user.id',
        'user.avatar',
        'user.firstName',
        'user.lastName',
        'user.dateOfBirth',
        'user.email',
        'user.createdAt',
        'user.gender',
        'user.role',
        'city.code',
        'city.name',
        'district.id',
        'district.name',
      ]);

    if (search) {
      qb.andWhere(
        `(user.firstName ILIKE :search OR user.lastName ILIKE :search)`,
        { search: `%${search}%` },
      );
    }

    if (role) {
      qb.andWhere('user.role = :role', { role });
    }

    if (city) {
      qb.andWhere('city.code = :city', { city });
    }

    if (district) {
      qb.andWhere('district.id = :district', { district });
    }

    qb.skip(Number(skip));
    qb.take(Number(limit));

    const finalOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    qb.orderBy(`user.${sort}`, finalOrder);

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
      filters: { role, city, district, search },
      data: users,
    };
  }

  // =========================================================
  // FIND ONE
  // =========================================================
  async findOne(id: string): Promise<{
    status: number;
    message: string;
    data: User;
  }> {
    const user = await this.findOneDataOnly(id);

    return {
      status: 200,
      message: 'User retrieved successfully',
      data: user,
    };
  }

  // =========================================================
  // UPDATE
  // =========================================================
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
      relations: { city: true, district: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { city, district, password, ...rest } = updateUserDto;
    const updateData: Partial<User> = { ...rest };

    const finalCityCode = city ?? user.city?.code;
    const finalDistrictId = district ?? user.district?.id;

    // validate city
    const isCity = await this.cityRepository.findOne({
      where: { code: finalCityCode },
    });
    if (!isCity) {
      throw new NotFoundException('City not found');
    }

    // validate district belongs to city
    const isDistrict = await this.districtRepository.findOne({
      where: {
        id: finalDistrictId,
        city: { code: finalCityCode },
      },
    });
    if (!isDistrict) {
      throw new NotFoundException('District does not belong to selected city');
    }

    updateData.city = isCity;
    updateData.district = isDistrict;

    if (password) {
      const saltOrRounds = Number(process.env.SALT_OR_ROUNDS);
      updateData.password = await bcrypt.hash(password, saltOrRounds);
    }

    await this.userRepository.update(id, updateData);

    const updatedUserData = await this.findOneDataOnly(id);

    return {
      status: 200,
      message: 'User updated successfully',
      data: updatedUserData,
    };
  }

  // =========================================================
  // DELETE
  // =========================================================
  async delete(id: string): Promise<{
    status: number;
    message: string;
  }> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.update(id, { isActive: false });

    return {
      status: 200,
      message: 'User deleted successfully',
    };
  }

  // =========================================================
  // HELPERS (QueryBuilder)
  // =========================================================
  private async findOneDataOnly(id: string): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.city', 'city')
      .leftJoin('user.district', 'district')
      .select([
        'user.id',
        'user.avatar',
        'user.firstName',
        'user.lastName',
        'user.dateOfBirth',
        'user.email',
        'user.createdAt',
        'user.gender',
        'user.role',
        'city.code',
        'city.name',
        'district.id',
        'district.name',
      ])
      .where('user.id = :id', { id })
      .getOne();

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
