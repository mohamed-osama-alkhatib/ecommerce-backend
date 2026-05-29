// representative.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Company } from './company.entity';

@Entity('representatives')
export class Representative {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', length: 20 })
  phone!: string;

  @Column({ type: 'varchar', length: 100 })
  region!: string;

  // علاقة: كل مندوب يتبع لشركة واحدة
  @ManyToOne(() => Company, (company) => company.representatives, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'company_id' })
  company!: Company;
}
