import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { City } from './city.entity';

@Entity('districts')
export class District {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 50 })
  name!: string;

  @ManyToOne(() => City, (city) => city.districts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'city_code' })
  city!: City;
}
