import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { City } from '../entities/city.entity';
import { citiesData } from '../data/cities.data';

@Injectable()
export class CitySeed implements OnModuleInit {
  constructor(
    @InjectRepository(City)
    private cityRepository: Repository<City>,
  ) {}

  async onModuleInit() {
    const count = await this.cityRepository.count();

    if (count > 0) return;

    await this.cityRepository.save(citiesData);

    console.log('✅ Cities seeded!');
  }
}
