// user.entity.ts
// libs
import {
  Entity,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
// entities
import { City } from './city.entity';
import { District } from './district.entity';

// enums
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
  // =========================================================
  // ID
  // =========================================================
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // =========================================================
  // AVATAR
  // =========================================================
  @Column({ type: 'varchar', nullable: true })
  avatar?: string;

  // =========================================================
  // FIRST NAME
  // =========================================================
  @Column({ type: 'varchar', length: 15 })
  firstName!: string;

  // =========================================================
  // LAST NAME
  // =========================================================
  @Column({ type: 'varchar', length: 15 })
  lastName!: string;

  // =========================================================
  // DATE OF BIRTH
  // =========================================================
  @Column({ type: 'date' })
  dateOfBirth!: Date;

  // =========================================================
  // CITY
  // =========================================================
  @ManyToOne(() => City)
  @JoinColumn({ name: 'city_code' })
  city!: City;
  // =========================================================
  // DISTRICT
  // =========================================================
  @ManyToOne(() => District)
  @JoinColumn({ name: 'district_id' })
  district!: District;

  // =========================================================
  // EMAIL
  // =========================================================
  @Column({ type: 'varchar', length: 50, unique: true })
  email!: string;

  // =========================================================
  // PASSWORD
  // =========================================================
  @Column({ type: 'varchar' })
  password!: string;

  // =========================================================
  // CREATED AT
  // =========================================================
  @CreateDateColumn()
  createdAt!: Date;

  // =========================================================
  // VERIFICATION CODE
  // =========================================================
  @Column({ type: 'varchar', length: 6, nullable: true })
  verificationCode?: string | null;

  // =========================================================
  // IS ACTIVE
  // =========================================================
  @Column({ type: 'boolean', default: false, nullable: true })
  isActive?: boolean;

  // =========================================================
  // GENDER
  // =========================================================
  @Column({
    type: 'enum',
    enum: Gender,
  })
  gender!: Gender;

  // =========================================================
  // ROLE
  // =========================================================
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.CLIENT,
    nullable: true,
  })
  role?: Role;
  // =========================================================
  //
  // =========================================================
}
