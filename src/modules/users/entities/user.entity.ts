// user.entity.ts
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { City } from './city.entity';
import { District } from './district.entity';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

export enum Role {
  ADMIN = 'admin',
  EMPLOYEE = 'employee',
  CLIENT = 'client',
}

@Entity('users')
export class User {
  @PrimaryColumn({ type: 'varchar', length: 16 })
  id!: string;

  @Column({ type: 'varchar' })
  avatar!: string;

  @Column({ type: 'varchar', length: 15 })
  firstName!: string;

  @Column({ type: 'varchar', length: 15 })
  lastName!: string;

  @Column({ type: 'int' })
  age!: number;

  @ManyToOne(() => City, { eager: true })
  @JoinColumn({ name: 'city_code' })
  city!: City;

  @ManyToOne(() => District, { eager: true })
  @JoinColumn({ name: 'district_id' })
  district!: District;

  @Column({ type: 'varchar', length: 10, unique: true })
  phoneNumber!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ type: 'varchar', length: 16, unique: true })
  shamCashId!: string;

  @Column({ type: 'varchar', length: 6, nullable: true })
  verificationCode?: string;

  @Column({ type: 'boolean', default: false })
  isActive!: boolean;

  @Column({
    type: 'enum',
    enum: Gender,
  })
  gender!: Gender;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.CLIENT,
  })
  role!: Role;

  @BeforeInsert()
  generateId() {
    const year = new Date().getFullYear();
    this.id = `${year}zl${this.phoneNumber}`;
  }
}
