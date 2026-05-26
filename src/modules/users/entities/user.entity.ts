// user.entity.ts
// libs
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
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
  @PrimaryColumn({ type: 'varchar', length: 50 })
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
  // AGE
  // =========================================================
  @Column({ type: 'int' })
  age!: number;

  // =========================================================
  // CITY
  // =========================================================
  @ManyToOne(() => City, { eager: true })
  @JoinColumn({ name: 'city_code' })
  city!: City;
  // =========================================================
  // DISTRICT
  // =========================================================
  @ManyToOne(() => District, { eager: true })
  @JoinColumn({ name: 'district_id' })
  district!: District;

  // =========================================================
  // PHONE NUMBER
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
  // BL FOR GENERATING ID
  // =========================================================
  @BeforeInsert()
  generateId() {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const day = new Date().getDate();
    const hour = new Date().getHours();
    const min = new Date().getMinutes();
    const sec = new Date().getSeconds();
    const ms = new Date().getMilliseconds();
    const random = Math.floor(Math.random() * 1000);
    this.id = `${year}zl${month}zl${day}zl${hour}zl${min}zl${sec}zl${ms}zl${random}`;
  }
}
