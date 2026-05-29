// district.entity.ts
// libs
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
// entities
import { City } from './city.entity';

@Entity('districts')
export class District {
  @PrimaryColumn({ type: 'varchar', length: 7 })
  id!: string;

  @Column({ type: 'varchar', length: 50 })
  name!: string;

  @ManyToOne(() => City, (city) => city.districts, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'city_code' })
  city!: City;
}
