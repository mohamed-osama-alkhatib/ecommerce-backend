import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from '../entities/city.entity';

@Injectable()
export class CitySeed implements OnModuleInit {
  constructor(
    @InjectRepository(City)
    private cityRepository: Repository<City>,
  ) {}

  async onModuleInit() {
    const count = await this.cityRepository.count();
    if (count > 0) return;

    const cities = [
      { code: '011', name: 'دمشق', lat: 33.5138, lon: 36.2765 },
      { code: '021', name: 'حلب', lat: 36.2021, lon: 37.1343 },
      { code: '031', name: 'حمص', lat: 34.7308, lon: 36.7094 },
      { code: '041', name: 'اللاذقية', lat: 35.5319, lon: 35.7901 },
      { code: '051', name: 'حماة', lat: 35.1333, lon: 36.75 },
      { code: '061', name: 'طرطوس', lat: 34.8833, lon: 35.8833 },
      { code: '071', name: 'الرقة', lat: 35.95, lon: 39.0167 },
      { code: '081', name: 'دير الزور', lat: 35.3333, lon: 40.15 },
      { code: '091', name: 'الحسكة', lat: 36.5, lon: 40.75 },
      { code: '101', name: 'درعا', lat: 32.6258, lon: 36.1056 },
      { code: '111', name: 'السويداء', lat: 32.7, lon: 36.5667 },
      { code: '121', name: 'إدلب', lat: 35.9308, lon: 36.6339 },
      { code: '131', name: 'القنيطرة', lat: 33.1258, lon: 35.8244 },
      { code: '141', name: 'ريف دمشق', lat: 33.5833, lon: 36.4 },
    ];

    await this.cityRepository.save(cities);
    console.log('✅ Cities seeded!');
  }
}
