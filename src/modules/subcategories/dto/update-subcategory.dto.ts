import { PartialType } from '@nestjs/mapped-types';
import { SubcategoryDto } from './subcategory.dto';

export class UpdateSubcategoryDto extends PartialType(SubcategoryDto) {
  name!: string;
  image!: string;
  description?: string;
  category!: string;
}
