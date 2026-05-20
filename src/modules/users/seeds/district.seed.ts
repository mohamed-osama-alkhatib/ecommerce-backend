import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { District } from '../entities/district.entity';
import { City } from '../entities/city.entity';

import { districtsData } from '../data/districts.data';

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

    const districts: District[] = [];

    for (const city of cities) {
      const cityDistricts = districtsData[city.code];

      if (!cityDistricts) continue;

      cityDistricts.forEach((districtName, index) => {
        const district = this.districtRepository.create({
          id: `${city.code}${String(index + 1).padStart(4, '0')}`,
          name: districtName,
          city,
        });

        districts.push(district);
      });
    }

    await this.districtRepository.save(districts);

    console.log('✅ Districts seeded!');
  }
}
