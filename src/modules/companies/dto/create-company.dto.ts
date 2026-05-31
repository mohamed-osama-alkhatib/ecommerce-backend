import { PartialType } from '@nestjs/mapped-types';
import { CompanyDto } from './company.dto';
import { WorkingDays } from '../../../common/entities/company.entity';

export class CreateCompanyDto extends PartialType(CompanyDto) {
  name!: string;
  logo?: string;
  description?: string;
  complaintNumber!: string;
  foundationDate!: Date;
  taxNumber!: string;
  workingDays!: WorkingDays[];
}
