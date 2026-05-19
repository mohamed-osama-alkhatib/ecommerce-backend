import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
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

  async create(createUserDto: CreateUserDto, user) {
    const payload = user.payload;
    console.log(payload);

    const { cityCode, districtId, ...rest } = createUserDto;

    const city = await this.cityRepository.findOne({
      where: { code: cityCode },
    });

    if (!city) {
      throw new Error('City not found');
    }

    const district = await this.districtRepository.findOne({
      where: { id: districtId },
    });

    if (!district) {
      throw new Error('District not found');
    }

    const userData = this.userRepository.create({
      ...rest,
      city,
      district,
    });

    return await this.userRepository.save(userData);
  }

  async findAll() {
    return await this.userRepository.find();
  }
}
