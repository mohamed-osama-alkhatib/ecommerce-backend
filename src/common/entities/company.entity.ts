// company.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Representative } from './representative.entity';
import { City } from './city.entity';

export enum WorkingDays {
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
}

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', nullable: true })
  logo!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  complaintNumber!: string;

  @Column({ type: 'date', nullable: true })
  foundationDate!: Date;

  @Column({ type: 'varchar', unique: true })
  taxNumber!: string;

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 0 })
  rating!: number;

  @Column({ type: 'enum', enum: WorkingDays, array: true, default: [] })
  workingDays!: WorkingDays[];

  @CreateDateColumn()
  joinedAt!: Date;

  // ================= Relations =================

  @OneToMany(() => Representative, (representative) => representative.company, {
    cascade: true,
  })
  representatives!: Representative[];

  @ManyToMany(() => City)
  @JoinTable({
    name: 'company_served_cities',
    joinColumn: { name: 'company_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'city_code', referencedColumnName: 'code' },
  })
  servedCities!: City[];
}
