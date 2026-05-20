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
  // ----- ID -------------------------------------------------------------
  @PrimaryColumn({ type: 'varchar', length: 16 })
  id!: string;

  // ----- AVATAR -------------------------------------------------------------
  @Column({ type: 'varchar', nullable: true })
  avatar?: string;

  // ----- FIRST NAME -------------------------------------------------------------
  @Column({ type: 'varchar', length: 15 })
  firstName!: string;

  // ----- LAST NAME -------------------------------------------------------------
  @Column({ type: 'varchar', length: 15 })
  lastName!: string;

  // ----- AGE -------------------------------------------------------------
  @Column({ type: 'int' })
  age!: number;

  // ----- CITY ID -------------------------------------------------------------
  @ManyToOne(() => City, { eager: true })
  @JoinColumn({ name: 'city_code' })
  city!: City;

  // ----- DISTRICT ID -------------------------------------------------------------
  @ManyToOne(() => District, { eager: true })
  @JoinColumn({ name: 'district_id' })
  district!: District;

  // ----- PHONE NUMBER -------------------------------------------------------------
  @Column({ type: 'varchar', length: 10, unique: true })
  phoneNumber!: string;

  // ----- PASSWORD -------------------------------------------------------------
  @Column({ type: 'varchar' })
  password!: string;

  // ----- CREATED AT -------------------------------------------------------------
  @CreateDateColumn()
  createdAt!: Date;

  // ----- SHAMCASH ID -------------------------------------------------------------
  @Column({ type: 'varchar', length: 16, unique: true, nullable: true })
  shamCashId?: string;

  // ----- VERIFICATION CODE -------------------------------------------------------------
  @Column({ type: 'varchar', length: 6, nullable: true })
  verificationCode?: string;

  // ----- IS ACTIVE -------------------------------------------------------------
  @Column({ type: 'boolean', default: false, nullable: true })
  isActive?: boolean;

  // ----- GENDER -------------------------------------------------------------
  @Column({
    type: 'enum',
    enum: Gender,
  })
  gender!: Gender;

  // ----- ROLE -------------------------------------------------------------
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.CLIENT,
    nullable: true,
  })
  role?: Role;

  // ----- BL -------------------------------------------------------------
  @BeforeInsert()
  generateId() {
    const year = new Date().getFullYear();
    this.id = `${year}zl${this.phoneNumber}`;
  }
}
