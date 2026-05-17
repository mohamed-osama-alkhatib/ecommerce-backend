import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  Index,
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
  // ✅ ID = سنة الإنشاء + 'zl' + رقم الهاتف (read-only)
  @PrimaryColumn({ type: 'varchar', length: 20, update: false })
  id!: string;

  @Column({ type: 'varchar', length: 15 })
  firstName!: string;

  @Column({ type: 'varchar', length: 15 })
  lastName!: string;

  @Column({ type: 'int' })
  age!: number;

  @ManyToOne(() => City, { eager: true })
  @JoinColumn({ name: 'city_code' })
  city!: City;

  @ManyToOne(() => District, { eager: true, nullable: true })
  @JoinColumn({ name: 'district_id' })
  district!: District;

  // ✅ رقم هاتف فريد، يبدأ بـ 09، 10 أرقام
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 10, unique: true })
  phoneNumber!: string;

  // ✅ تاريخ الإنشاء تلقائي
  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  // ✅ ShamCash ID = 16 رقم
  @Column({ type: 'varchar', length: 16, unique: true })
  shamCashId!: string;

  // ✅ كود التحقق (OTP) — يُمسح بعد التحقق
  @Column({ type: 'varchar', length: 6, nullable: true })
  verificationCode!: string;

  // ✅ هل تم التحقق؟
  @Column({ type: 'boolean', default: false })
  isVerified!: boolean;

  @Column({ type: 'enum', enum: Gender })
  gender!: Gender;

  @Column({ type: 'enum', enum: Role, default: Role.CLIENT })
  role!: Role;

  // ========== Hooks ==========

  @BeforeInsert()
  generateId() {
    const year = new Date().getFullYear().toString(); // '2026'
    this.id = `${year}zl${this.phoneNumber}`; // '2026zl0991234567'
  }

  @BeforeInsert()
  generateShamCashId() {
    // توليد 16 رقم عشوائي
    this.shamCashId = Array.from({ length: 16 }, () =>
      Math.floor(Math.random() * 10),
    ).join('');
  }
}
