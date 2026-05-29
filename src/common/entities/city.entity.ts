// city.entity.ts
// libs
import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
// entities
import { District } from './district.entity';

@Entity('cities')
export class City {
  @PrimaryColumn({ type: 'varchar', length: 3, unique: true })
  code!: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  name!: string;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  lat!: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  lon!: number;

  @OneToMany(() => District, (district) => district.city, { cascade: true })
  districts!: District[];
}
