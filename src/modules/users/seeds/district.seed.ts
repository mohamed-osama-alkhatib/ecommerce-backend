import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { District } from '../entities/district.entity';
import { City } from '../entities/city.entity';

@Injectable()
export class DistrictSeed implements OnModuleInit {
  constructor(
    @InjectRepository(District)
    private districtRepository: Repository<District>,
    @InjectRepository(City)
    private cityRepository: Repository<City>,
  ) {}

  async onModuleInit() {
    const count = await this.districtRepository.count();
    if (count > 0) return;

    const cities = await this.cityRepository.find();

    for (const city of cities) {
      const district = this.districtRepository.create({
        id: `${city.code}0001`, // مثلاً: 0110001
        name: `ناحية ${city.name}`,
        city: city,
      });
      await this.districtRepository.save(district);
    }

    console.log('✅ Districts seeded!');
  }
}
