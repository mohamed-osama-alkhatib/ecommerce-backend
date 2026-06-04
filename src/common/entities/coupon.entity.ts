import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('coupons')
export class Coupon {
  // =========================================================
  // ID
  // =========================================================
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  // =========================================================
  // CREATED AT
  // =========================================================
  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;
  // =========================================================
  // CODE
  // =========================================================
  @Column({ type: 'varchar', length: 20, unique: true })
  code!: string;
  // =========================================================
  // DISCOUNT
  // =========================================================
  @Column({ type: 'integer' })
  discount!: number;
  // =========================================================
  // EXPIRE DATE
  // =========================================================
  @Column({ type: 'timestamptz' })
  expireDate!: Date;
  // =========================================================
  // IS ACTIVE
  // =========================================================
  @Column({ type: 'boolean', default: true })
  isActive!: boolean;
}
